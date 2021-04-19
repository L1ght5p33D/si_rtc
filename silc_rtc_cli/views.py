from django.http import HttpResponse, request
from django.template.response import TemplateResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import json

@csrf_exempt
def si_rtc_local(request):
    return TemplateResponse(request, 'rtc_client_local.html', {'VIEWREQ': request})

@csrf_exempt
def si_rtc_remote(request):
    return TemplateResponse(request, 'rtc_client_remote.html', {'VIEWREQ': request})

