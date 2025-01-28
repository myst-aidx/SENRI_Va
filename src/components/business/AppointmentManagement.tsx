import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ChevronLeft,
  Home,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  User,
  Video,
  MapPin,
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  RefreshCw,
  Settings,
  Bell,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

declare global {
  interface Window {
    gapi: any;
  }
}

// Google Calendar APIのクライアントID
const GOOGLE_CALENDAR_CLIENT_ID = import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID;
const GOOGLE_CALENDAR_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
// Zoom API Key
const ZOOM_API_KEY = import.meta.env.VITE_ZOOM_API_KEY;
const ZOOM_API_SECRET = import.meta.env.VITE_ZOOM_API_SECRET;

interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  type: 'offline' | 'online';
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  cost: number;
  notes: string;
  location?: string;
  meetingUrl?: string;
  googleEventId?: string;
  reminderSent: boolean;
  reminderScheduled: boolean;
}

// モックデータ
const mockAppointments: Appointment[] = [
  {
    id: "A001",
    customerId: "C001",
    customerName: "山田 花子",
    customerEmail: "hanako@example.com",
    type: "offline",
    service: "タロット占い",
    date: "2024-02-15",
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    status: "scheduled",
    cost: 8500,
    notes: "初回カウンセリング",
    location: "渋谷店 カウンセリングルーム1",
    googleEventId: "abc123",
    reminderSent: false,
    reminderScheduled: false
  },
  {
    id: "A002",
    customerId: "C002",
    customerName: "鈴木 一郎",
    customerEmail: "ichiro@example.com",
    type: "online",
    service: "四柱推命",
    date: "2024-02-16",
    startTime: "15:30",
    endTime: "17:00",
    duration: 90,
    status: "scheduled",
    cost: 12000,
    notes: "Zoom経由での鑑定",
    meetingUrl: "https://zoom.us/j/123456789",
    googleEventId: "def456",
    reminderSent: false,
    reminderScheduled: false
  }
];

interface FilterOptions {
  type: string;
  status: string;
  service: string;
  dateRange: string;
}

// Google Calendar APIの初期化と認証
const initGoogleCalendarApi = async () => {
  try {
    // Google APIが利用可能かチェック
    if (!window.gapi) {
      throw new Error('Google APIが利用できません');
    }

    // APIキーとクライアントIDが設定されているかチェック
    if (!GOOGLE_CALENDAR_CLIENT_ID || !GOOGLE_CALENDAR_API_KEY) {
      throw new Error('Google Calendar APIの設定が必要です');
    }

    // Google APIの初期化
    await new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', {
        callback: resolve,
        onerror: reject
      });
    });

    // Google Calendar APIの初期化
    await window.gapi.client.init({
      apiKey: GOOGLE_CALENDAR_API_KEY,
      clientId: GOOGLE_CALENDAR_CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.events'
    });

    // 認証状態の確認
    const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
    if (!isSignedIn) {
      // 未認証の場合は認証を実行
      await window.gapi.auth2.getAuthInstance().signIn({
        prompt: 'select_account'
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize Google Calendar API:', error);
    return false;
  }
};

// Zoom APIを使用してミーティングを作成
const createZoomMeeting = async (appointment: Appointment) => {
  try {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZOOM_API_KEY}`,
      },
      body: JSON.stringify({
        topic: `占い鑑定: ${appointment.service}`,
        type: 2, // スケジュール済みミーティング
        start_time: `${appointment.date}T${appointment.startTime}:00`,
        duration: appointment.duration,
        timezone: 'Asia/Tokyo',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
        },
      }),
    });
    const data = await response.json();
    return data.join_url;
  } catch (error) {
    console.error('Failed to create Zoom meeting:', error);
    return null;
  }
};

// 予約の重複をチェック
const checkAppointmentOverlap = (
  appointments: Appointment[],
  newAppointment: Appointment,
  excludeId?: string
) => {
  const newStart = new Date(`${newAppointment.date}T${newAppointment.startTime}`);
  const newEnd = new Date(newStart.getTime() + newAppointment.duration * 60000);

  return appointments.some(appointment => {
    if (appointment.id === excludeId) return false;
    if (appointment.status === 'cancelled') return false;

    const existingStart = new Date(`${appointment.date}T${appointment.startTime}`);
    const existingEnd = new Date(existingStart.getTime() + appointment.duration * 60000);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
};

// リマインダーメールを送信
const sendReminderEmail = async (appointment: Appointment) => {
  try {
    const response = await fetch('/api/send-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointmentId: appointment.id,
        customerEmail: appointment.customerEmail,
        appointmentDetails: {
          date: appointment.date,
          time: appointment.startTime,
          service: appointment.service,
          type: appointment.type,
          meetingUrl: appointment.meetingUrl,
        },
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return false;
  }
};

// リマインダーをスケジュール
const scheduleReminder = async (appointment: Appointment) => {
  try {
    const response = await fetch('/api/schedule-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointmentId: appointment.id,
        scheduledTime: new Date(`${appointment.date}T${appointment.startTime}`).getTime() - 24 * 60 * 60 * 1000, // 24時間前
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to schedule reminder:', error);
    return false;
  }
};

// Google Calendarとの同期処理
const handleGoogleCalendarSync = async () => {
  try {
    setIsSyncing(true);

    // Google Calendar APIの初期化
    const isInitialized = await initGoogleCalendarApi();
    if (!isInitialized) {
      throw new Error('Google Calendar APIの初期化に失敗しました');
    }

    // ユーザーの認証状態を確認
    const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
    if (!isSignedIn) {
      // 未認証の場合は認証を実行
      await window.gapi.auth2.getAuthInstance().signIn();
    }

    // 予約情報をGoogle Calendarに同期
    const updatedAppointments = [...appointments];
    for (const appointment of updatedAppointments) {
      if (appointment.status === 'cancelled') continue;

      const event = {
        summary: `【${appointment.service}】${appointment.customerName}様`,
        description: `
予約内容：${appointment.service}
料金：¥${appointment.cost.toLocaleString()}
${appointment.type === 'online' ? 'オンライン予約' : '対面予約'}
${appointment.type === 'online' && appointment.meetingUrl ? `\nミーティングURL：${appointment.meetingUrl}` : ''}
${appointment.notes ? `\n備考：${appointment.notes}` : ''}
        `.trim(),
        start: {
          dateTime: `${appointment.date}T${appointment.startTime}:00`,
          timeZone: 'Asia/Tokyo'
        },
        end: {
          dateTime: `${appointment.date}T${appointment.endTime}:00`,
          timeZone: 'Asia/Tokyo'
        },
        location: appointment.type === 'offline' ? appointment.location : 'オンライン',
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 }
          ]
        }
      };

      if (!appointment.googleEventId) {
        // 新規イベントの作成
        const response = await window.gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event
        });
        appointment.googleEventId = response.result.id;
      } else {
        // 既存イベントの更新
        await window.gapi.client.calendar.events.update({
          calendarId: 'primary',
          eventId: appointment.googleEventId,
          resource: event
        });
      }
    }

    // 更新された予約情報を保存
    setAppointments(updatedAppointments);
    setIsGoogleCalendarSynced(true);
    alert('Google Calendarとの同期が完了しました');
  } catch (error) {
    console.error('Failed to sync with Google Calendar:', error);
    alert('Google Calendarとの同期に失敗しました');
  } finally {
    setIsSyncing(false);
  }
};

export default function AppointmentManagement() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: 'all',
    status: 'all',
    service: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('week');
  const [isGoogleCalendarSynced, setIsGoogleCalendarSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Google Calendarとの同期処理
  const handleGoogleCalendarSync = async () => {
    try {
      setIsSyncing(true);

      // Google Calendar APIの初期化
      const isInitialized = await initGoogleCalendarApi();
      if (!isInitialized) {
        throw new Error('Google Calendar APIの初期化に失敗しました');
      }

      // ユーザーの認証状態を確認
      const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
      if (!isSignedIn) {
        // 未認証の場合は認証を実行
        await window.gapi.auth2.getAuthInstance().signIn();
      }

      // 予約情報をGoogle Calendarに同期
      const updatedAppointments = [...appointments];
      for (const appointment of updatedAppointments) {
        if (appointment.status === 'cancelled') continue;

        const event = {
          summary: `【${appointment.service}】${appointment.customerName}様`,
          description: `
予約内容：${appointment.service}
料金：¥${appointment.cost.toLocaleString()}
${appointment.type === 'online' ? 'オンライン予約' : '対面予約'}
${appointment.type === 'online' && appointment.meetingUrl ? `\nミーティングURL：${appointment.meetingUrl}` : ''}
${appointment.notes ? `\n備考：${appointment.notes}` : ''}
          `.trim(),
          start: {
            dateTime: `${appointment.date}T${appointment.startTime}:00`,
            timeZone: 'Asia/Tokyo'
          },
          end: {
            dateTime: `${appointment.date}T${appointment.endTime}:00`,
            timeZone: 'Asia/Tokyo'
          },
          location: appointment.type === 'offline' ? appointment.location : 'オンライン',
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 30 }
            ]
          }
        };

        if (!appointment.googleEventId) {
          // 新規イベントの作成
          const response = await window.gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event
          });
          appointment.googleEventId = response.result.id;
        } else {
          // 既存イベントの更新
          await window.gapi.client.calendar.events.update({
            calendarId: 'primary',
            eventId: appointment.googleEventId,
            resource: event
          });
        }
      }

      // 更新された予約情報を保存
      setAppointments(updatedAppointments);
      setIsGoogleCalendarSynced(true);
      alert('Google Calendarとの同期が完了しました');
    } catch (error) {
      console.error('Failed to sync with Google Calendar:', error);
      alert('Google Calendarとの同期に失敗しました');
    } finally {
      setIsSyncing(false);
    }
  };

  // 初期データの読み込み
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // TODO: 実際のAPIコールに置き換える
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAppointments(mockAppointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // TODO: 検索ロジックの実装
  };

  const handleFilter = (options: FilterOptions) => {
    setFilterOptions(options);
    // TODO: フィルタリングロジックの実装
  };

  const handleAddAppointment = () => {
    setShowAddModal(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteConfirm(true);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 20; i++) {
      slots.push(`${i}:00`);
      slots.push(`${i}:30`);
    }
    return slots;
  };

  // 予約の追加
  const handleAddAppointmentSubmit = async (formData: any) => {
    try {
      // 重複チェック
      const isOverlapping = checkAppointmentOverlap(appointments, formData);
      if (isOverlapping) {
        alert('選択された時間帯は既に予約が入っています。');
        return;
      }

      // オンライン予約の場合、Zoomミーティングを作成
      let meetingUrl = null;
      if (formData.type === 'online') {
        meetingUrl = await createZoomMeeting(formData);
        if (!meetingUrl) {
          alert('Zoomミーティングの作成に失敗しました。');
          return;
        }
      }

      // 予約を保存
      const newAppointment = {
        ...formData,
        id: Date.now().toString(),
        meetingUrl,
        reminderScheduled: false,
        reminderSent: false,
      };

      setAppointments([...appointments, newAppointment]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add appointment:', error);
      alert('予約の追加に失敗しました。');
    }
  };

  // 予約の編集
  const handleEditAppointmentSubmit = async (formData: any) => {
    try {
      // 重複チェック（自身の予約は除外）
      const isOverlapping = checkAppointmentOverlap(appointments, formData, formData.id);
      if (isOverlapping) {
        alert('選択された時間帯は既に予約が入っています。');
        return;
      }

      // オンライン予約の場合、必要に応じてZoomミーティングを更新
      let meetingUrl = formData.meetingUrl;
      if (formData.type === 'online' && (!meetingUrl || formData.date !== selectedAppointment?.date || formData.startTime !== selectedAppointment?.startTime)) {
        meetingUrl = await createZoomMeeting(formData);
        if (!meetingUrl) {
          alert('Zoomミーティングの更新に失敗しました。');
          return;
        }
      }

      // 予約を更新
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === formData.id
          ? {
              ...formData,
              meetingUrl,
              reminderScheduled: false,
              reminderSent: false,
            }
          : appointment
      );

      setAppointments(updatedAppointments);
      setShowEditModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to edit appointment:', error);
      alert('予約の編集に失敗しました。');
    }
  };

  // 予約の削除
  const handleDeleteAppointmentConfirm = async () => {
    try {
      if (!selectedAppointment) return;

      // 予約を削除（実際はステータスを'cancelled'に変更）
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === selectedAppointment.id
          ? { ...appointment, status: 'cancelled' as const }
          : appointment
      );

      setAppointments(updatedAppointments);
      setShowDeleteConfirm(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('予約の削除に失敗しました。');
    }
  };

  // リマインダーのチェックを定期的に実行
  useEffect(() => {
    const checkReminders = async () => {
      const now = new Date();
      const appointmentsToRemind = appointments.filter(appointment => {
        if (appointment.status === 'cancelled' || appointment.reminderSent) return false;
        
        const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
        const timeDiff = appointmentDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        return hoursDiff <= 24 && hoursDiff > 0;
      });

      for (const appointment of appointmentsToRemind) {
        const success = await sendReminderEmail(appointment);
        if (success) {
          setAppointments(prevAppointments =>
            prevAppointments.map(a =>
              a.id === appointment.id ? { ...a, reminderSent: true } : a
            )
          );
        }
      }
    };

    const intervalId = setInterval(checkReminders, 5 * 60 * 1000); // 5分ごとにチェック
    return () => clearInterval(intervalId);
  }, [appointments]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/business')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <ChevronLeft size={24} />
            <span>戻る</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoogleCalendarSync}
              disabled={isSyncing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isGoogleCalendarSynced
                  ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30'
                  : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
              }`}
            >
              <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
              <span>
                {isSyncing 
                  ? '同期中...' 
                  : isGoogleCalendarSynced 
                    ? 'カレンダー同期済み'
                    : 'Google Calendarと同期'
                }
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-purple-200 hover:text-purple-100 rounded-full hover:bg-purple-800/30"
              >
                <Settings size={24} />
              </button>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-purple-900 rounded-lg shadow-xl z-50"
                >
                  <div className="py-2">
                    <button
                      onClick={() => {
                        // Google Calendar設定
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-800/50 flex items-center space-x-2"
                    >
                      <CalendarIcon size={16} />
                      <span>Google Calendar設定</span>
                    </button>
                    <button
                      onClick={() => {
                        // リマインダー設定
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-800/50 flex items-center space-x-2"
                    >
                      <Bell size={16} />
                      <span>リマインダー設定</span>
                    </button>
                    <button
                      onClick={() => {
                        // Zoom設定
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-800/50 flex items-center space-x-2"
                    >
                      <Video size={16} />
                      <span>Zoom設定</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
            >
              <Home size={24} />
              <span>ホーム</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">予約管理</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-800/30 rounded-lg p-1">
                <button
                  onClick={() => setCalendarView('month')}
                  className={`px-3 py-1 rounded ${
                    calendarView === 'month'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-300 hover:text-purple-100'
                  }`}
                >
                  月
                </button>
                <button
                  onClick={() => setCalendarView('week')}
                  className={`px-3 py-1 rounded ${
                    calendarView === 'week'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-300 hover:text-purple-100'
                  }`}
                >
                  週
                </button>
                <button
                  onClick={() => setCalendarView('day')}
                  className={`px-3 py-1 rounded ${
                    calendarView === 'day'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-300 hover:text-purple-100'
                  }`}
                >
                  日
                </button>
              </div>
              <button
                onClick={handleAddAppointment}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                <span>新規予約</span>
              </button>
            </div>
          </div>

          {/* カレンダーヘッダー */}
          <div className="bg-purple-800/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    if (calendarView === 'month') {
                      newDate.setMonth(currentDate.getMonth() - 1);
                    } else if (calendarView === 'week') {
                      newDate.setDate(currentDate.getDate() - 7);
                    } else {
                      newDate.setDate(currentDate.getDate() - 1);
                    }
                    setCurrentDate(newDate);
                  }}
                  className="p-2 hover:bg-purple-700/30 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    ...(calendarView === 'day' && { day: 'numeric' })
                  })}
                </h2>
                <button
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    if (calendarView === 'month') {
                      newDate.setMonth(currentDate.getMonth() + 1);
                    } else if (calendarView === 'week') {
                      newDate.setDate(currentDate.getDate() + 7);
                    } else {
                      newDate.setDate(currentDate.getDate() + 1);
                    }
                    setCurrentDate(newDate);
                  }}
                  className="p-2 hover:bg-purple-700/30 rounded-full"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-purple-700/30 hover:bg-purple-700/50 rounded-lg"
              >
                今日
              </button>
            </div>
          </div>

          {/* 週間カレンダービュー */}
          <div className="bg-purple-800/20 rounded-lg overflow-hidden">
            <div className="grid grid-cols-8 border-b border-purple-700/30">
              <div className="p-4 text-center font-medium"></div>
              {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                <div
                  key={day}
                  className={`p-4 text-center font-medium ${
                    index === 0 ? 'text-red-300' : index === 6 ? 'text-blue-300' : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-8">
              <div className="border-r border-purple-700/30">
                {getTimeSlots().map((time) => (
                  <div
                    key={time}
                    className="h-20 p-2 border-b border-purple-700/30 text-sm text-purple-300"
                  >
                    {time}
                  </div>
                ))}
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="relative">
                  {getTimeSlots().map((time) => (
                    <div
                      key={time}
                      className="h-20 p-2 border-b border-r border-purple-700/30"
                    >
                      {appointments
                        .filter(
                          (appointment) =>
                            appointment.startTime === time &&
                            new Date(appointment.date).getDay() === dayIndex
                        )
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            onClick={() => handleEditAppointment(appointment)}
                            className={`cursor-pointer p-2 rounded text-xs ${
                              appointment.type === 'online'
                                ? 'bg-blue-500/20 text-blue-100'
                                : 'bg-green-500/20 text-green-100'
                            }`}
                          >
                            <div className="font-medium">{appointment.customerName}</div>
                            <div className="flex items-center mt-1">
                              {appointment.type === 'online' ? (
                                <Video size={12} className="mr-1" />
                              ) : (
                                <MapPin size={12} className="mr-1" />
                              )}
                              <span>{appointment.service}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 新規予約モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-purple-900 rounded-lg shadow-xl max-w-2xl w-full"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">新規予約</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">予約タイプ</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="appointmentType"
                          value="offline"
                          className="text-purple-600"
                        />
                        <span>対面占い</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="appointmentType"
                          value="online"
                          className="text-purple-600"
                        />
                        <span>オンライン占い</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">顧客名</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                      placeholder="顧客を選択または検索"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">サービス</label>
                    <select
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    >
                      <option value="">サービスを選択</option>
                      <option value="tarot">タロット占い</option>
                      <option value="fourpillars">四柱推命</option>
                      <option value="palm">手相占い</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">日付</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">開始時間</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">所要時間</label>
                    <select
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    >
                      <option value="30">30分</option>
                      <option value="60">60分</option>
                      <option value="90">90分</option>
                      <option value="120">120分</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">料金</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                      placeholder="¥"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">メモ</label>
                    <textarea
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 h-32"
                      placeholder="予約に関する特記事項があれば入力してください"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-purple-300 hover:text-purple-100"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    予約
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* 予約詳細・編集モーダル */}
      {selectedAppointment && showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">予約詳細</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-purple-300 hover:text-purple-100"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">基本情報</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-purple-300">予約タイプ</label>
                      <div className="flex items-center mt-1">
                        {selectedAppointment.type === 'online' ? (
                          <>
                            <Video size={16} className="mr-2" />
                            <span>オンライン占い</span>
                          </>
                        ) : (
                          <>
                            <MapPin size={16} className="mr-2" />
                            <span>対面占い</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-purple-300">顧客名</label>
                      <div className="mt-1 font-medium">{selectedAppointment.customerName}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-purple-300">サービス</label>
                      <div className="mt-1">{selectedAppointment.service}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-purple-300">日時</label>
                      <div className="mt-1">
                        {selectedAppointment.date} {selectedAppointment.startTime}～{selectedAppointment.endTime}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-purple-300">料金</label>
                      <div className="mt-1">¥{selectedAppointment.cost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">詳細情報</h3>
                  <div className="space-y-4">
                    {selectedAppointment.type === 'offline' && selectedAppointment.location && (
                      <div>
                        <label className="block text-sm text-purple-300">場所</label>
                        <div className="mt-1">{selectedAppointment.location}</div>
                      </div>
                    )}
                    {selectedAppointment.type === 'online' && selectedAppointment.meetingUrl && (
                      <div>
                        <label className="block text-sm text-purple-300">ミーティングURL</label>
                        <div className="mt-1">
                          <a
                            href={selectedAppointment.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            {selectedAppointment.meetingUrl}
                          </a>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-purple-300">メモ</label>
                      <div className="mt-1">{selectedAppointment.notes}</div>
                    </div>
                    {selectedAppointment.googleEventId && (
                      <div>
                        <label className="block text-sm text-purple-300">Google Calendar</label>
                        <div className="mt-1 flex items-center text-green-400">
                          <Check size={16} className="mr-2" />
                          <span>同期済み</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => handleDeleteAppointment(selectedAppointment)}
                  className="px-4 py-2 text-red-400 hover:text-red-300"
                >
                  削除
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-purple-300 hover:text-purple-100"
                >
                  閉じる
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  編集
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {showDeleteConfirm && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-purple-900 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">予約の削除</h2>
              <p className="mb-6">
                {selectedAppointment.customerName}さんの{selectedAppointment.date} {selectedAppointment.startTime}の予約を削除しますか？
                この操作は取り消せません。
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-purple-300 hover:text-purple-100"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDeleteAppointmentConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 