from textblob import TextBlob
from .models import Service, Categorie
from reservations.models import Avis


def analyser_sentiment(commentaire):
    """
    Analyse le sentiment d'un commentaire
    Retourne un score entre -1 (négatif) et +1 (positif)
    """
    try:
        blob = TextBlob(commentaire)
        return blob.sentiment.polarity
    except:
        return 0.0


def calculer_score_ia(service, max_avis, max_prix):
    """
    Calcule le score IA d'un service basé sur :
    - Note moyenne      (40%)
    - Fiabilité avis    (20%)
    - Prix              (10%)
    - Sentiment NLP     (30%)
    """
    # 1. Note moyenne (40%)
    note = service.note_moyenne() or 0
    score_note = (note / 5) * 0.40

    # 2. Fiabilité (20%)
    avis = Avis.objects.filter(prestataire=service.prestataire)
    nb_avis = avis.count()
    score_fiabilite = (nb_avis / max_avis if max_avis > 0 else 0) * 0.20

    # 3. Prix (10%)
    score_prix = (1 - (float(service.prix) / max_prix if max_prix > 0 else 0)) * 0.10

    # 4. Sentiment NLP (30%)
    if avis.exists():
        sentiments = [analyser_sentiment(a.commentaire) for a in avis]
        sentiment_moyen = sum(sentiments) / len(sentiments)
        score_sentiment = ((sentiment_moyen + 1) / 2) * 0.30
    else:
        score_sentiment = 0.15

    score_final = round(score_note + score_fiabilite + score_prix + score_sentiment, 4)
    return score_final


def meilleur_par_categorie():
    categories = Categorie.objects.all()
    tous_services = Service.objects.filter(disponible=True, statut='approuve')

    if not tous_services.exists():
        return []

    max_avis = max(
        (Avis.objects.filter(prestataire=s.prestataire).count() for s in tous_services),
        default=1
    ) or 1

    max_prix = max(
        (float(s.prix) for s in tous_services),
        default=1
    ) or 1

    resultats = []
    for categorie in categories:
        services_categorie = tous_services.filter(categorie=categorie)
        if not services_categorie.exists():
            continue
        meilleur = max(services_categorie, key=lambda s: calculer_score_ia(s, max_avis, max_prix))
        meilleur.score_ia = calculer_score_ia(meilleur, max_avis, max_prix)
        resultats.append(meilleur)

    return sorted(resultats, key=lambda s: s.score_ia, reverse=True)