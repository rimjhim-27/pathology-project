import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { API_URL } from '../config';

export function useTestPackages() {
  const { data: testPackages, isLoading, error } = useQuery({
    queryKey: ['testPackages'],
    queryFn: () => apiRequest(`${API_URL}/api/test-packages`),
  });

  return {
    testPackages: testPackages || [],
    isLoading,
    error,
  };
}

export function useIndividualTests() {
  const { data: individualTests, isLoading, error } = useQuery({
    queryKey: ['individualTests'],
    queryFn: () => apiRequest(`${API_URL}/api/individual-tests`),
  });

  return {
    individualTests: individualTests || [],
    isLoading,
    error,
  };
}

export function useTestimonials() {
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => apiRequest(`${API_URL}/api/testimonials`),
  });

  return {
    testimonials: testimonials || [],
    isLoading,
    error,
  };
}

export function useFAQs() {
  const { data: faqs, isLoading, error } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => apiRequest(`${API_URL}/api/faqs`),
  });

  return {
    faqs: faqs || [],
    isLoading,
    error,
  };
}

export async function createBooking(booking: any) {
  return apiRequest(`${API_URL}/api/bookings`, {
    method: 'POST',
    body: JSON.stringify(booking),
  });
}

export function useBookings() {
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiRequest(`${API_URL}/api/bookings`),
  });

  return {
    bookings: bookings || [],
    isLoading,
    error,
    createBooking,
    loading: isLoading,
  };
}