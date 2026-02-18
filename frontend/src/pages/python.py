import os

# creating files in folder using python
dashboards = {"PlatformLandingPage.jsx", "MainOprationDashboard.jsx", "EventDirectory.jsx", "EventWorkspaceShell.jsx", "EventSummaryDashboards.jsx", "OprationalEventSchedule.jsx", "EventAnalyticsReports.jsx", "OrganizationAnalyticsDashboards.jsx"}
settings = {"OragnizationSetting.jsx", "EventAdminstrativeSetting.jsx", "UserProfileSetting.jsx", "GlobalAppSetting.jsx"}
forms = {"UserLogin.jsx", "UserSignup.jsx", "ResetPassword.jsx", "CreateNewEvent.jsx", "GuestDataEntry.jsx","RoomconfigurationForm.jsx", "NewServiceRequest.jsx"}
inventorys = {"TeamMemberManagement.jsx", "GuestMasterList.jsx", "RoomInventoryManagement.jsx", "CheckInOprationDesk.jsx", "TransportCoordinationLogs.jsx", "ServiceRequestLogs.jsx", "ActivityAndNotificationLogs.jsx"}
others = {"GuestProfileView.jsx", "SystemLoadingState.jsx", "PageNotFound.jsx", "UnauthorizedAccessWarning.jsx", "EmptyStateWorkSpace.jsx", "DeleteActionModel.jsx", "OprationSuccessIndicator.jsx", "LogoutConfirmation.jsx"}



folder = "./event/frontend/src/pages/settings"

# create folder if not exists
os.makedirs(folder, exist_ok=True)

for item in settings:
    with open(f"{folder}/{item}", "w") as f:
        pass
