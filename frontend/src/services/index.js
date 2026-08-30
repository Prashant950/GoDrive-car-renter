// Core API and Base Query
export { apiSlice } from "./apiSlice.js";

// Auth API
export {
  authApi,
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "./authApi.js";

// User Services
export {
  userVehicleApi,
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
} from "./user/userVehicleApi.js";

export {
  userBookingApi,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,
} from "./user/userBookingApi.js";

export {
  userProfileApi,
  useUpdateProfileMutation,
} from "./user/userProfileApi.js";

export {
  userContactApi,
  useSendContactMutation,
} from "./user/userContactApi.js";

export {
  userNotificationApi,
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from "./user/userNotificationApi.js";

export {
  userPaymentApi,
  usePayRegistrationMutation,
} from "./user/userPaymentApi.js";

// Admin Services
export {
  adminVehicleApi,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from "./admin/adminVehicleApi.js";

export {
  adminBookingApi,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} from "./admin/adminBookingApi.js";

export {
  adminUserApi,
  useGetAllUsersQuery,
  useGetUserStatsQuery,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} from "./admin/adminUserApi.js";

export {
  adminContactApi,
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} from "./admin/adminContactApi.js";

export {
  adminNotificationApi,
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationReadMutation,
  useMarkAllAdminNotificationsReadMutation,
  useDeleteAdminNotificationMutation,
} from "./admin/adminNotificationApi.js";

// Category Services
export {
  categoryApi,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "./categoryApi.js";
