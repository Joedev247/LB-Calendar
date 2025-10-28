// Types for Settings API
export interface AccountSettings {
  name: string;
  email: string;
}

export interface NotificationSettings {
  notifications: {
    email: {
      eventReminders: boolean;
      taskDeadlines: boolean;
      teamUpdates: boolean;
      systemNotifications: boolean;
    };
    push: {
      enabled: boolean;
      eventReminders: boolean;
      taskDeadlines: boolean;
      teamUpdates: boolean;
    };
  };
}

export interface AppearanceSettings {
  appearance: {
    theme: 'light' | 'dark';
    primaryColor: string;
  };
}

export interface CalendarSettings {
  calendar: {
    weekStartsOn: 0 | 1;
    defaultView: 'month' | 'week' | 'day' | 'agenda';
    timeFormat: '12h' | '24h';
    workingHours: {
      start: string;
      end: string;
    };
  };
}

export interface PrivacySettings {
  privacy: {
    calendarVisibility: 'public' | 'team' | 'private';
    eventDetailsVisibility: 'public' | 'team' | 'private';
    profileVisibility: 'public' | 'team' | 'private';
  };
}

export interface TeamSettings {
  teamSettings: {
    allowMembersCreateEvents: boolean;
    allowMembersEditSettings: boolean;
    allowMembersInvite: boolean;
  };
}

export interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
}

export interface Settings extends 
  AccountSettings,
  NotificationSettings,
  AppearanceSettings,
  CalendarSettings,
  PrivacySettings,
  TeamSettings {
  userId: string;
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}