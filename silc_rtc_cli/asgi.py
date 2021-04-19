"""
ASGI config for si_rtc_cli project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""
#Default Imports

import django
import os
#from django.core.asgi import get_asgi_application

django.setup()
# Channels imports
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
#from .generic_routing import ProtocolTypeRouter, URLRouter


# WS Ice Imports
from django.conf.urls import url
from . import si_rtc_consumer


# Fetch Django ASGI application early to ensure AppRegistry is populated
# before importing consumers and AuthMiddlewareStack that may import ORM
# models.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'si_rtc_cli.settings')



#application = get_asgi_application()


si_ws_ice_urlpatterns = [
    url(r'^ws_ice/(?P<room_name>[\w]+)/$', si_rtc_consumer.WSTurnConsumer),
]

#turn_urlpatterns = [
#    url(r'^turn_ice/(?P<room_name>[\w]+)/$', si_rtc_consumer.WSTurnIceConsumer),
#]
# 


application = ProtocolTypeRouter({
# ICE Signaling socket 
    'websocket':
        AuthMiddlewareStack(
            URLRouter(
                si_ws_ice_urlpatterns
            )
        )

}
)


