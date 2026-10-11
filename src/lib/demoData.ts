import type {
  AdminBookingRow,
  AdminDashboardStats,
  AdminPatientRow,
  AdminProviderRow,
} from '@/lib/adminApi';

export const DEMO_STATS: AdminDashboardStats = {
  patients: 2,
  providers_total: 4,
  providers_pending: 2,
  providers_by_profession: { doctor: 1, nurse: 1, assistant: 1, physio: 1 },
  bookings_total: 3,
  payments_paid_count: 2,
  payments_paid_amount: 2698,
  payments_unpaid_count: 1,
};

export const DEMO_PROVIDERS: AdminProviderRow[] = [
  {
    id: 'demo_prov_doc_01',
    full_name: 'Dr. Ananya Sharma',
    phone: '+91 98765 43210',
    profession: 'doctor',
    city: 'Delhi',
    license_no: 'MCI-88421',
    qualification: 'MBBS, MD',
    verification_status: 'approved',
  },
  {
    id: 'demo_prov_nurse_01',
    full_name: 'Priya Verma',
    phone: '+91 98111 22334',
    profession: 'nurse',
    city: 'Gurgaon',
    license_no: 'NUR-55201',
    qualification: 'GNM, BSc Nursing',
    verification_status: 'pending',
  },
  {
    id: 'demo_prov_asst_01',
    full_name: 'Rahul Mehta',
    phone: '+91 99000 11223',
    profession: 'assistant',
    city: 'Noida',
    license_no: 'NAS-11092',
    qualification: 'Nursing Assistant',
    verification_status: 'pending',
  },
  {
    id: 'demo_prov_physio_01',
    full_name: 'Kavya Iyer',
    phone: '+91 98222 33445',
    profession: 'physio',
    city: 'Delhi',
    license_no: 'PT-77210',
    qualification: 'BPT',
    verification_status: 'approved',
  },
];

export const DEMO_PATIENTS: AdminPatientRow[] = [
  { id: 'demo_patient_01', full_name: 'Ramesh Kapoor', phone: '+91 91234 56789', home_label: 'Green Park' },
  { id: 'demo_patient_02', full_name: 'Sunita Devi', phone: '+91 99887 76655', home_label: 'Sector 62' },
];

export const DEMO_BOOKINGS: AdminBookingRow[] = [
  {
    id: 'a1111111-1111-4111-8111-111111111101',
    status: 'COMPLETED',
    service: 'home_visit',
    amount: 1499,
    payment_status: 'paid',
    created_at: new Date().toISOString(),
    patient_id: 'demo_patient_01',
    patient_name: 'Ramesh Kapoor',
    professional_id: 'demo_prov_doc_01',
    professional_name: 'Dr. Ananya Sharma',
    profession: 'doctor',
  },
  {
    id: 'a1111111-1111-4111-8111-111111111102',
    status: 'CONFIRMED',
    service: 'wound_care',
    amount: 899,
    payment_status: 'unpaid',
    created_at: new Date().toISOString(),
    patient_id: 'demo_patient_02',
    patient_name: 'Sunita Devi',
    professional_id: 'demo_prov_nurse_01',
    professional_name: 'Priya Verma',
    profession: 'nurse',
  },
  {
    id: 'a1111111-1111-4111-8111-111111111103',
    status: 'COMPLETED',
    service: 'rehab',
    amount: 1199,
    payment_status: 'paid',
    created_at: new Date().toISOString(),
    patient_id: 'demo_patient_01',
    patient_name: 'Ramesh Kapoor',
    professional_id: 'demo_prov_physio_01',
    professional_name: 'Kavya Iyer',
    profession: 'physio',
  },
];
