import json
from channels.generic.websocket import AsyncWebsocketConsumer



class WSTurnConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WSTurnConsumer connect ")
        # self.room_name = self.scope['url_route']['kwargs']['room_name']
        # self.room_group_name = 'chat_%s' % self.room_name
        # Just set group name for testing ...
        #self.room_name = "wsturnroomtest"
        #self.room_group_name = "wsturnchatroomtest"
        self.room_name = "wsturn_dev"
        self.room_group_name = "wsturn_group_dev"
  
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        print("receive turn offer")
        text_data_json = json.loads(text_data)
        # turn_sig = text_data_json['turn_signal']

        await self.channel_layer.group_send(
            self.room_group_name,
            {   "type": "si_ws_message",
               "payload": text_data_json
                }
        )


    # Not group send
    # Receive message from room group
    # async def chat_message(self, event):
    #     print("chat message event fire ")
    #     message = event['message']
    #
    #     # Send message to WebSocket
    #     await self.send(text_data=json.dumps({
    #         'message': message
    #     }))

    # Receive message from room group
    async def si_ws_message(self, event):
        print("si_ws_message  event fire ")
        print(json.dumps(event))
        # Send another message to WebSocket
        await self.send(text_data=json.dumps(event))


