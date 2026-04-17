import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  UserPlus, Trash2, Search, Users, X, AlertCircle, CheckCircle2
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  class_id: string;
  created_at: string;
}

interface ClassStudentsManagerProps {
  classId: string;
  onStudentCountChange?: (count: number) => void;
}

const ClassStudentsManager: React.FC<ClassStudentsManagerProps> = ({ classId, onStudentCountChange }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_students')
        .select('*')
        .eq('class_id', classId)
        .order('name', { ascending: true });

      if (error) throw error;
      const list = data || [];
      setStudents(list);
      onStudentCountChange?.(list.length);
    } catch {
      // Table may not exist yet — treat as empty
      setStudents([]);
      onStudentCountChange?.(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingle = async () => {
    const name = newName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('class_students')
        .insert({ class_id: classId, name })
        .select()
        .single();
      if (error) throw error;
      const updated = [...students, data].sort((a, b) => a.name.localeCompare(b.name));
      setStudents(updated);
      onStudentCountChange?.(updated.length);
      setNewName('');
      setShowAddForm(false);
      setToast({ type: 'success', message: `${name} added successfully` });
    } catch {
      setToast({ type: 'error', message: 'Failed to add student. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddBulk = async () => {
    const names = bulkNames
      .split('\n')
      .map(n => n.trim())
      .filter(Boolean);
    if (!names.length) return;
    setSaving(true);
    try {
      const rows = names.map(name => ({ class_id: classId, name }));
      const { data, error } = await supabase
        .from('class_students')
        .insert(rows)
        .select();
      if (error) throw error;
      const updated = [...students, ...(data || [])].sort((a, b) => a.name.localeCompare(b.name));
      setStudents(updated);
      onStudentCountChange?.(updated.length);
      setBulkNames('');
      setShowAddForm(false);
      setToast({ type: 'success', message: `${names.length} student${names.length > 1 ? 's' : ''} added` });
    } catch {
      setToast({ type: 'error', message: 'Failed to add students. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('class_students')
        .delete()
        .eq('id', id);
      if (error) throw error;
      const updated = students.filter(s => s.id !== id);
      setStudents(updated);
      onStudentCountChange?.(updated.length);
      setDeleteConfirmId(null);
      setToast({ type: 'success', message: `${name} removed` });
    } catch {
      setToast({ type: 'error', message: 'Failed to remove student.' });
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
          toast.type === 'success'
            ? 'bg-greyed-navy/8 text-greyed-navy border border-greyed-navy/10'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 size={16} className="flex-shrink-0" />
            : <AlertCircle size={16} className="flex-shrink-0" />}
          {toast.message}
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-greyed-navy" />
          <h2 className="text-base font-bold text-greyed-navy">
            Students
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({students.length} enrolled)
            </span>
          </h2>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setAddMode('single'); }}
          className="flex items-center gap-2 px-4 py-2 bg-greyed-navy text-white rounded-xl hover:bg-greyed-navy/90 transition-colors text-sm font-semibold"
        >
          <UserPlus size={15} />
          Add Student
        </button>
      </div>

      {/* Add student form */}
      {showAddForm && (
        <div className="bg-greyed-white border border-greyed-beige/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-greyed-navy text-sm">Add Student(s)</h3>
            <button onClick={() => { setShowAddForm(false); setNewName(''); setBulkNames(''); }}
              className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-4 w-fit">
            {(['single', 'bulk'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setAddMode(mode)}
                className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                  addMode === mode
                    ? 'bg-greyed-navy text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {mode === 'single' ? 'Single' : 'Bulk (paste list)'}
              </button>
            ))}
          </div>

          {addMode === 'single' ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddSingle(); }}
                placeholder="Student full name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
                autoFocus
              />
              <button
                onClick={handleAddSingle}
                disabled={!newName.trim() || saving}
                className="px-4 py-2 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Adding…' : 'Add'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={bulkNames}
                onChange={e => setBulkNames(e.target.value)}
                placeholder={"One name per line:\nJohn Smith\nMary Dube\nThabo Mokoena"}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40 resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowAddForm(false); setBulkNames(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBulk}
                  disabled={!bulkNames.trim() || saving}
                  className="px-4 py-2 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Adding…' : `Add ${bulkNames.split('\n').filter(n => n.trim()).length || ''} Students`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search */}
      {students.length > 0 && (
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search students…"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Student list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 border-greyed-navy/20 border-t-greyed-navy rounded-full animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-greyed-navy/10 rounded-2xl">
          <Users className="w-10 h-10 text-greyed-navy/20 mx-auto mb-3" />
          <h3 className="font-semibold text-greyed-navy mb-1">No students yet</h3>
          <p className="text-sm text-gray-500 mb-4">Add students individually or paste a list of names.</p>
          <button
            onClick={() => { setShowAddForm(true); setAddMode('single'); }}
            className="px-4 py-2 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-navy/90 transition-colors"
          >
            Add First Student
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No students match "<span className="font-medium">{searchTerm}</span>"
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-greyed-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Added</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((student, index) => (
                <tr key={student.id} className="hover:bg-greyed-white/60 transition-colors group">
                  <td className="px-4 py-3 text-sm text-gray-400 w-10">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-greyed-navy/8 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-greyed-navy">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(student.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {deleteConfirmId === student.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(student.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove student"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassStudentsManager;
