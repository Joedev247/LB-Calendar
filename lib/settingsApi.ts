import {
  Settings,
  AccountSettings,
  NotificationSettings,
  AppearanceSettings,
  CalendarSettings,
  PrivacySettings,
  TeamSettings,
  SecuritySettings
} from './types/settings';

// Settings API functions
export async function getSettings(): Promise<Settings> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  
  return response.json();
}

export async function updateAccountSettings(data: AccountSettings) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/account`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update account settings');
  }
  
  return response.json();
}

export async function updateNotificationSettings(data: NotificationSettings) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/notifications`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update notification settings');
  }
  
  return response.json();
}

export async function updateAppearanceSettings(data: AppearanceSettings) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/appearance`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update appearance settings');
  }
  
  return response.json();
}

export async function updateCalendarSettings(data: CalendarSettings) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/calendar`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update calendar settings');
  }
  
  return response.json();
}

export async function updatePrivacySettings(data: PrivacySettings) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/privacy`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update privacy settings');
  }
  
  return response.json();
}

export async function updateTeamSettings(data: TeamSettings) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/team`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update team settings');
  }
  
  return response.json();
}

export async function changePassword(data: SecuritySettings) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/security/password`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to change password');
  }
  
  return response.json();
}

export async function toggle2FA(enabled: boolean) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/security/2fa`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ enabled })
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle 2FA');
  }
  
  return response.json();
}