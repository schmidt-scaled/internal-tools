import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

export function useUsers() {
  const [users, setUsers] = useState<Tables['users']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, refetch: fetchUsers };
}

export function useEnvironments() {
  const [environments, setEnvironments] = useState<Tables['environments']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    try {
      const { data, error } = await supabase
        .from('environments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setEnvironments(data || []);
    } catch (error) {
      console.error('Error fetching environments:', error);
    } finally {
      setLoading(false);
    }
  };

  return { environments, loading, refetch: fetchEnvironments };
}

export function useTestTypes() {
  const [testTypes, setTestTypes] = useState<Tables['test_types']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestTypes();
  }, []);

  const fetchTestTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('test_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTestTypes(data || []);
    } catch (error) {
      console.error('Error fetching test types:', error);
    } finally {
      setLoading(false);
    }
  };

  return { testTypes, loading, refetch: fetchTestTypes };
}

export function useReservations() {
  const [reservations, setReservations] = useState<(Tables['environment_reservations']['Row'] & {
    environments: Tables['environments']['Row'];
    users: Tables['users']['Row'];
  })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('environment_reservations')
        .select(`
          *,
          environments(*),
          users(*)
        `)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  return { reservations, loading, refetch: fetchReservations };
}

export function useTestRuns() {
  const [testRuns, setTestRuns] = useState<(Tables['test_runs']['Row'] & {
    test_types: Tables['test_types']['Row'];
    environments: Tables['environments']['Row'];
  })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestRuns();
  }, []);

  const fetchTestRuns = async () => {
    try {
      const { data, error } = await supabase
        .from('test_runs')
        .select(`
          *,
          test_types(*),
          environments(*)
        `)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      setTestRuns(data || []);
    } catch (error) {
      console.error('Error fetching test runs:', error);
    } finally {
      setLoading(false);
    }
  };

  return { testRuns, loading, refetch: fetchTestRuns };
}