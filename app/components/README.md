# Calendar App Components

This directory contains all the reusable components for the Welha Calendar application.

## Component Structure

### 📁 Components Overview

```
components/
├── Sidebar.tsx       - Left navigation sidebar with logo, menu items, and Go PRO section
├── Header.tsx        - Top header with welcome message and user profile
├── Calendar.tsx      - Monthly calendar grid with date selection
├── TaskList.tsx      - Today's task list with checkboxes
├── Notification.tsx  - Notification card with latest updates
└── TeamChat.tsx      - Team chat interface with messages and input
```

## Component Details

### 1. **Sidebar.tsx**
- **Purpose**: Main navigation for the application
- **Features**:
  - Welha logo with orange gradient
  - Navigation menu (Home, Project, Calendar, Team Chat, Settings)
  - Active state highlighting for Calendar
  - Go PRO promotion card with illustration
  - Person with laptop SVG illustration
- **Styling**: Purple gradient background with white text

### 2. **Header.tsx**
- **Purpose**: Top header bar for the main content area
- **Features**:
  - Welcome message with notification icon
  - User profile picture
  - User email display
  - Notification bell icon
- **Props**: None (static for now)

### 3. **Calendar.tsx**
- **Purpose**: Interactive monthly calendar
- **Features**:
  - Month/Year display with dropdown icon
  - 7-day week header (Sun-Sat)
  - Date grid with proper week alignment
  - Day 18 highlighted in orange gradient
  - Clickable dates with hover effects
  - Current selection state management
- **State**: 
  - `selectedDate`: Currently selected day (default: 18)
- **Props**: None (uses internal state)

### 4. **TaskList.tsx**
- **Purpose**: Display today's tasks
- **Features**:
  - Task count badge
  - Add task button (+)
  - Checkbox for each task
  - Task name and time display
  - Hover effects on task items
- **Data**: Static task array (can be made dynamic)

### 5. **Notification.tsx**
- **Purpose**: Display important notifications
- **Features**:
  - Purple gradient background with decorative circles
  - "View all" link
  - Notification icon
  - Message preview
  - Timestamp
  - "Assign now" call-to-action button
- **Styling**: Glassmorphism effect with backdrop blur

### 6. **TeamChat.tsx**
- **Purpose**: Team communication interface
- **Features**:
  - Team member avatars (3 stacked)
  - "Invite People" button
  - Message list with user avatars
  - Username and message content
  - Message input field
  - Emoji button
  - Send button (paper plane icon)
- **Data**: Static message array (can be connected to chat API)

## Usage Example

```tsx
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import Notification from './components/Notification';
import TeamChat from './components/TeamChat';

export default function Home() {
  return (
    <div className="app-container">
      <Sidebar />
      <main>
        <Header />
        <Calendar />
        <TaskList />
      </main>
      <aside>
        <Notification />
        <TeamChat />
      </aside>
    </div>
  );
}
```

## Color Palette

### Primary Colors
- **Purple**: `#5D4C8E` - Main theme color
- **Orange**: `#FFB76B` to `#FFA043` - Accent color (gradients)
- **Light Purple**: `#6B5A9C` - Secondary purple

### UI Colors
- **Background**: `#F5F6FA` - Light gray background
- **White**: `#FFFFFF` - Card backgrounds
- **Text**: `#1F2937` - Primary text color
- **Gray**: Various shades for secondary text and borders

## Responsive Considerations

Currently optimized for desktop view. Mobile responsiveness can be added by:
1. Making sidebar collapsible
2. Stacking right sidebar below main content
3. Adjusting grid layouts for smaller screens
4. Adding hamburger menu for mobile navigation

## Future Improvements

- [ ] Add TypeScript interfaces for props
- [ ] Make components more configurable with props
- [ ] Add state management (Context API / Redux)
- [ ] Connect to backend API for real data
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement real-time chat functionality
- [ ] Add task CRUD operations
- [ ] Implement calendar date range selection
- [ ] Add animations and transitions


