from django.urls import path
from .views import (
    DashboardSummaryView, DashboardSettingsView, NotificationListView,
    SavedReportListView, GenerateReportView, MarkNotificationReadView
)

urlpatterns = [
    path('', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('settings/', DashboardSettingsView.as_view(), name='dashboard-settings'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('reports/', SavedReportListView.as_view(), name='saved-reports'),
    path('reports/generate/', GenerateReportView.as_view(), name='generate-report'),
]