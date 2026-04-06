import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        contenu = data['contenu']
        destinataire_id = data['destinataire_id']
        expediteur = self.scope['user']
        await self.sauvegarder_message(expediteur, destinataire_id, contenu)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'contenu': contenu,
                'expediteur': expediteur.username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'contenu': event['contenu'],
            'expediteur': event['expediteur'],
        }))

    @database_sync_to_async
    def sauvegarder_message(self, expediteur, destinataire_id, contenu):
        destinataire = User.objects.get(id=destinataire_id)
        Message.objects.create(
            expediteur=expediteur,
            destinataire=destinataire,
            contenu=contenu
        )