import axios from 'axios';
import { API_BASE_URL } from '../context/AuthContext';

export interface CenterData {
  id: number;
  center_code: string;
  name: string;
  district: string;
  address?: string;
  latitude: number;
  longitude: number;
  total_counters: number;
  active_counters: number;
  capacity: number;
  status: string;
  average_processing_time: number;
  queue_length: number;
  estimated_wait: number;
  distance_km?: number;
}

export interface CropData {
  id: number;
  name: string;
  name_mr?: string;
  name_hi?: string;
  unit: string;
  reference_price?: number;
  msp?: number;
}

export interface TokenData {
  id: number;
  token_id: string;
  farmer_id: number;
  farmer_name: string;
  farmer_farmer_id: string;
  center_id: number;
  center_name: string;
  crop_id: number;
  crop_name: string;
  quantity: number;
  actual_quantity?: number;
  slot_id?: number;
  status: string;
  current_stage: string;
  queue_position?: number;
  estimated_wait?: number;
  counter_id?: number;
  procurement_rate?: number;
  total_amount?: number;
  payment_status: string;
  created_at?: string;
}

export const api = {
  // Centers & Recommendations
  async getCenters(lat?: number, lon?: number): Promise<CenterData[]> {
    try {
      const res = await axios.get(`${API_BASE_URL}/centers`, { params: { lat, lon } });
      return res.data;
    } catch {
      return [
        {
          id: 1,
          center_code: "PC-PUN-01",
          name: "Pune Agriculture Procurement Center (APMC Market Yard)",
          district: "Pune",
          latitude: 18.4905,
          longitude: 73.8687,
          total_counters: 4,
          active_counters: 3,
          capacity: 150,
          status: "active",
          average_processing_time: 12.0,
          queue_length: 12,
          estimated_wait: 25.0,
          distance_km: 4.2
        },
        {
          id: 2,
          center_code: "PC-BAR-02",
          name: "Baramati Kisan Sahakari Procurement Yard",
          district: "Pune",
          latitude: 18.1517,
          longitude: 74.5772,
          total_counters: 4,
          active_counters: 2,
          capacity: 120,
          status: "active",
          average_processing_time: 15.0,
          queue_length: 5,
          estimated_wait: 15.0,
          distance_km: 7.8
        },
        {
          id: 3,
          center_code: "PC-NSK-03",
          name: "Nashik Agri Grain Procurement Center",
          district: "Nashik",
          latitude: 20.0110,
          longitude: 73.7903,
          total_counters: 5,
          active_counters: 4,
          capacity: 200,
          status: "active",
          average_processing_time: 11.0,
          queue_length: 18,
          estimated_wait: 32.0,
          distance_km: 12.4
        }
      ];
    }
  },

  async getRecommendations(cropId?: number, quantity?: number): Promise<any> {
    try {
      const res = await axios.get(`${API_BASE_URL}/recommendations/centers`, {
        params: { crop_id: cropId, quantity }
      });
      return res.data;
    } catch {
      return {
        recommended: {
          center_id: 1,
          center_name: "Pune Agriculture Procurement Center (APMC)",
          distance_km: 4.2,
          queue_length: 8,
          estimated_wait: 18.0,
          price: 2425.0,
          msp: 2425.0,
          capacity_available: true,
          score: 94.2,
          reasons: [
            "Short waiting time (18 min estimated wait)",
            "Active counters (4 operational counters)",
            "Close distance (4.2 km away)",
            "Guaranteed official MSP rate (₹2,425/Q)"
          ],
          score_breakdown: {
            distance_pct: 90,
            queue_pct: 92,
            wait_pct: 94,
            price_pct: 100,
            capacity_pct: 100
          }
        },
        alternatives: [
          {
            center_id: 2,
            center_name: "Baramati Kisan Sahakari Yard",
            distance_km: 7.8,
            queue_length: 14,
            estimated_wait: 28.0,
            price: 2410.0,
            msp: 2425.0,
            capacity_available: true,
            score: 79.5,
            reasons: ["Operational center", "Medium wait time"],
            score_breakdown: { distance_pct: 75, queue_pct: 70, wait_pct: 78, price_pct: 95, capacity_pct: 100 }
          }
        ]
      };
    }
  },

  async getCrops(): Promise<CropData[]> {
    try {
      const res = await axios.get(`${API_BASE_URL}/crops`);
      return res.data;
    } catch {
      return [
        { id: 1, name: "Wheat", name_mr: "गहू", name_hi: "गेहूं", unit: "quintal", reference_price: 2425.0, msp: 2425.0 },
        { id: 2, name: "Cotton", name_mr: "कापूस", name_hi: "कपास", unit: "quintal", reference_price: 7100.0, msp: 7020.0 },
        { id: 3, name: "Rice", name_mr: "भात (धान)", name_hi: "धान", unit: "quintal", reference_price: 2369.0, msp: 2369.0 },
        { id: 4, name: "Soybean", name_mr: "सोयाबीन", name_hi: "सोयाबीन", unit: "quintal", reference_price: 4892.0, msp: 4892.0 },
      ];
    }
  },

  async getSlots(centerId: number): Promise<any[]> {
    try {
      const res = await axios.get(`${API_BASE_URL}/slots`, { params: { center_id: centerId } });
      return res.data;
    } catch {
      return [
        { id: 101, start_time: "09:00", end_time: "10:00", available: 14, status: "available" },
        { id: 102, start_time: "10:00", end_time: "11:00", available: 7, status: "available" },
        { id: 103, start_time: "11:00", end_time: "12:00", available: 2, status: "limited" },
        { id: 104, start_time: "12:00", end_time: "13:00", available: 0, status: "full" },
      ];
    }
  },

  async bookSlot(data: { center_id: number; crop_id: number; quantity: number; slot_id: number }): Promise<TokenData> {
    const res = await axios.post(`${API_BASE_URL}/slots/book`, data);
    return res.data;
  },

  async getActiveToken(): Promise<TokenData | null> {
    try {
      const res = await axios.get(`${API_BASE_URL}/farmer/active-token`);
      return res.data;
    } catch {
      return {
        id: 123,
        token_id: "KF-2026-000123",
        farmer_id: 1,
        farmer_name: "Rajesh Baburao Pawar",
        farmer_farmer_id: "FARM1001",
        center_id: 1,
        center_name: "Pune Agriculture Procurement Center (APMC)",
        crop_id: 1,
        crop_name: "Wheat",
        quantity: 35.0,
        actual_quantity: 34.6,
        status: "in_queue",
        current_stage: "registration",
        queue_position: 12,
        estimated_wait: 25.0,
        procurement_rate: 2425.0,
        total_amount: 83905.0,
        payment_status: "pending",
        created_at: new Date().toISOString()
      };
    }
  },

  async getCenterQueue(centerId: number): Promise<any> {
    try {
      const res = await axios.get(`${API_BASE_URL}/centers/${centerId}/queue`);
      return res.data;
    } catch {
      return {
        center_id: centerId,
        center_name: "Pune Agriculture Procurement Center",
        total_waiting: 12,
        total_processing: 3,
        total_completed: 47,
        total_no_show: 2,
        active_counters: 4,
        average_wait: 25.0,
        queue: [
          { token_id: "KF-2026-000110", farmer_name: "Tukaram Shinde", crop: "Wheat", quantity: 30, position: 1, stage: "weighing", counter: 1 },
          { token_id: "KF-2026-000111", farmer_name: "Baburao Kadam", crop: "Cotton", quantity: 22, position: 2, stage: "verification", counter: 2 },
          { token_id: "KF-2026-000123", farmer_name: "Rajesh Baburao Pawar", crop: "Wheat", quantity: 35, position: 12, stage: "registration", wait_minutes: 25.0 },
        ]
      };
    }
  },

  async verifyFarmer(tokenId: string, notes?: string): Promise<TokenData> {
    const res = await axios.post(`${API_BASE_URL}/tokens/${tokenId}/verify`, { notes });
    return res.data;
  },

  async recordWeighing(tokenId: string, actualQuantity: number, notes?: string): Promise<TokenData> {
    const res = await axios.post(`${API_BASE_URL}/tokens/${tokenId}/weigh`, { actual_quantity: actualQuantity, notes });
    return res.data;
  },

  async completeProcurement(tokenId: string, notes?: string): Promise<TokenData> {
    const res = await axios.post(`${API_BASE_URL}/tokens/${tokenId}/procure`, { notes });
    return res.data;
  },

  async completePayment(tokenId: string, notes?: string): Promise<TokenData> {
    const res = await axios.post(`${API_BASE_URL}/tokens/${tokenId}/payment`, { notes });
    return res.data;
  },

  async advanceCounter(counterId: number): Promise<any> {
    const res = await axios.post(`${API_BASE_URL}/officer/counters/${counterId}/call-next`);
    return res.data;
  },

  async activateCounter(counterId: number): Promise<any> {
    const res = await axios.post(`${API_BASE_URL}/admin/counters/${counterId}/activate`);
    return res.data;
  },

  async getAdminDashboard(): Promise<any> {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/dashboard`);
      return res.data;
    } catch {
      return {
        total_centers: 6,
        active_farmers: 48,
        tokens_today: 184,
        completed_today: 132,
        average_wait: 23.5,
        congested_centers: 1
      };
    }
  },

  async getAdminAnalytics(): Promise<any> {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/analytics`);
      return res.data;
    } catch {
      return {
        tokens_per_hour: [
          { hour: "08:00", tokens: 14 },
          { hour: "10:00", tokens: 42 },
          { hour: "12:00", tokens: 51 },
          { hour: "14:00", tokens: 45 },
          { hour: "16:00", tokens: 39 },
        ],
        avg_wait_trend: [
          { time: "08:00", wait_min: 12 },
          { time: "10:00", wait_min: 24 },
          { time: "12:00", wait_min: 35 },
          { time: "14:00", wait_min: 26 },
          { time: "16:00", wait_min: 18 },
        ],
        queue_by_center: [
          { center: "Pune APMC", queue: 14, counters: 3 },
          { center: "Baramati Yard", queue: 5, counters: 2 },
          { center: "Nashik Center", queue: 18, counters: 4 },
          { center: "Nagpur Hub", queue: 9, counters: 2 },
        ],
        crop_procurement: [
          { crop: "Wheat", quintals: 1450, value_lakhs: 35.1 },
          { crop: "Cotton", quintals: 620, value_lakhs: 44.0 },
          { crop: "Rice", quintals: 980, value_lakhs: 23.2 },
          { crop: "Soybean", quintals: 810, value_lakhs: 37.2 },
        ],
        center_throughput: [
          { center: "Pune APMC", throughput_q_hr: 42.5 },
          { center: "Nashik Mandi", throughput_q_hr: 45.2 },
          { center: "Baramati Yard", throughput_q_hr: 38.0 },
        ],
        counter_utilization: [
          { counter: "Counter 1", utilization_pct: 92 },
          { counter: "Counter 2", utilization_pct: 88 },
          { counter: "Counter 3", utilization_pct: 74 },
          { counter: "Counter 4", utilization_pct: 65 },
        ]
      };
    }
  }
};
