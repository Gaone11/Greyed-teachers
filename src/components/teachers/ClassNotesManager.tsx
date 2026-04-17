import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, User, BookOpen, Users, Calendar, Search, Import as SortAsc, Filter, X } from 'lucide-react';
import EditableContent from '../ui/EditableContent';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  type: 'class' | 'lesson' | 'student';
  associatedWith?: {
    id: string;
    name: string;
  };
}

interface ClassNotesManagerProps {
  classId: string;
}

const ClassNotesManager: React.FC<ClassNotesManagerProps> = ({ classId }) => {
  // Mock data for demonstration
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Class Overview Notes',
      content: 'This class has been progressing well through the curriculum. Students are showing good understanding of core concepts.\n\nAreas to focus on:\n- Advanced problem solving techniques\n- Exam preparation strategies\n- Revision of key formulas',
      createdAt: '2025-05-15T10:30:00',
      updatedAt: '2025-05-15T10:30:00',
      type: 'class'
    },
    {
      id: '2',
      title: 'Newton\'s Laws Lesson Notes',
      content: 'Students struggled with the concept of inertia in Newton\'s First Law. Need to provide more practical examples next time.\n\nConcepts covered:\n- Newton\'s First Law\n- Newton\'s Second Law\n- Newton\'s Third Law',
      createdAt: '2025-05-10T14:20:00',
      updatedAt: '2025-05-12T09:15:00',
      type: 'lesson'
    },
    {
      id: '3',
      title: 'John Smith - Progress Notes',
      content: 'John has shown improvement in his understanding of mechanics. Homework completion rate has improved to 90%.\n\nStrengths:\n- Mathematical calculations\n- Lab work\n\nAreas for improvement:\n- Written explanations\n- Conceptual understanding',
      createdAt: '2025-05-08T11:45:00',
      updatedAt: '2025-05-08T11:45:00',
      type: 'student',
      associatedWith: {
        id: 'student-1',
        name: 'John Smith'
      }
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<'class' | 'lesson' | 'student' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    type: 'class'
  });

  // Filter notes based on active tab and search term
  const filteredNotes = notes.filter(note => {
    const matchesTab = activeTab === 'all' || note.type === activeTab;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Create a new note
  const handleCreateNote = () => {
    setCurrentNote(null);
    setNewNote({
      title: '',
      content: '',
      type: 'class'
    });
    setShowNoteEditor(true);
  };

  // Edit an existing note
  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      type: note.type,
      associatedWith: note.associatedWith
    });
    setShowNoteEditor(true);
  };

  // Delete a note
  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  // Save a note (new or edited)
  const handleSaveNote = () => {
    if (!newNote.title || !newNote.content) {
      alert('Please provide a title and content for the note.');
      return;
    }

    const now = new Date().toISOString();
    
    if (currentNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === currentNote.id 
          ? { 
              ...note, 
              title: newNote.title || note.title, 
              content: newNote.content || note.content,
              type: newNote.type as 'class' | 'lesson' | 'student' || note.type,
              updatedAt: now 
            } 
          : note
      ));
    } else {
      // Create new note
      const newId = `note-${Date.now()}`;
      setNotes([
        ...notes, 
        {
          id: newId,
          title: newNote.title || 'Untitled Note',
          content: newNote.content || '',
          type: newNote.type as 'class' | 'lesson' | 'student',
          createdAt: now,
          updatedAt: now,
          associatedWith: newNote.associatedWith
        }
      ]);
    }
    
    setShowNoteEditor(false);
  };

  // Get icon for note type
  const getNoteTypeIcon = (type: 'class' | 'lesson' | 'student') => {
    switch (type) {
      case 'class':
        return <Users className="w-5 h-5 text-greyed-blue" />;
      case 'lesson':
        return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'student':
        return <User className="w-5 h-5 text-greyed-navy" />;
      default:
        return <Pencil className="w-5 h-5 text-greyed-blue" />;
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-black">Class Notes</h2>
          <button 
            onClick={handleCreateNote}
            className="px-3 py-1.5 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 text-sm transition-colors flex items-center"
          >
            <PlusCircle size={14} className="mr-1" />
            New Note
          </button>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-greyed-beige" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} className="text-greyed-beige hover:text-greyed-beige" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 text-sm ${activeTab === 'all' ? 'bg-greyed-blue/20 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('class')}
              className={`px-3 py-2 text-sm ${activeTab === 'class' ? 'bg-greyed-blue/20 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Class
            </button>
            <button
              onClick={() => setActiveTab('lesson')}
              className={`px-3 py-2 text-sm ${activeTab === 'lesson' ? 'bg-greyed-blue/20 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Lessons
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3 py-2 text-sm ${activeTab === 'student' ? 'bg-greyed-blue/20 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Students
            </button>
          </div>
        </div>
        
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-greyed-navy/10 rounded-lg">
            <Pencil className="w-12 h-12 text-greyed-navy/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No notes found</h3>
            <p className="text-black/70 max-w-md mx-auto mb-4">
              {searchTerm 
                ? "No notes match your search criteria. Try a different search term."
                : `You haven't created any ${activeTab !== 'all' ? activeTab : ''} notes yet.`}
            </p>
            <button 
              onClick={handleCreateNote}
              className="px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors inline-flex items-center"
            >
              <PlusCircle size={16} className="mr-2" />
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div 
                key={note.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getNoteTypeIcon(note.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-black">{note.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>Updated {formatDate(note.updatedAt)}</span>
                        
                        {note.type === 'student' && note.associatedWith && (
                          <span className="ml-2 bg-greyed-navy/10 text-greyed-navy px-2 py-0.5 rounded-full text-xs">
                            {note.associatedWith.name}
                          </span>
                        )}
                        
                        {note.type === 'lesson' && (
                          <span className="ml-2 bg-greyed-navy/10 text-greyed-navy px-2 py-0.5 rounded-full text-xs">
                            Lesson Note
                          </span>
                        )}
                        
                        {note.type === 'class' && (
                          <span className="ml-2 bg-greyed-blue/20 text-greyed-navy px-2 py-0.5 rounded-full text-xs">
                            Class Note
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-1 text-greyed-beige hover:text-greyed-blue hover:bg-greyed-blue/10 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-greyed-beige hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-gray-700 text-sm whitespace-pre-line line-clamp-3">
                  {note.content}
                </div>
                <button
                  onClick={() => handleEditNote(note)}
                  className="mt-3 text-xs text-greyed-blue hover:underline"
                >
                  View and edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Note Editor Modal */}
      {showNoteEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-headline font-bold">
                {currentNote ? 'Edit Note' : 'Create New Note'}
              </h3>
              <button 
                onClick={() => setShowNoteEditor(false)}
                className="text-greyed-beige hover:text-greyed-beige"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                  placeholder="Enter note title"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote({...newNote, type: e.target.value as 'class' | 'lesson' | 'student'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                >
                  <option value="class">Class Note</option>
                  <option value="lesson">Lesson Note</option>
                  <option value="student">Student Note</option>
                </select>
              </div>
              
              {newNote.type === 'student' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={newNote.associatedWith?.id}
                    onChange={(e) => setNewNote({
                      ...newNote, 
                      associatedWith: {
                        id: e.target.value,
                        name: e.target.options[e.target.selectedIndex].text
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                  >
                    <option value="">Select a student</option>
                    <option value="student-1">John Smith</option>
                    <option value="student-2">Sarah Johnson</option>
                    <option value="student-3">Michael Brown</option>
                    <option value="student-4">Emily Davis</option>
                  </select>
                </div>
              )}
              
              {newNote.type === 'lesson' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
                  <select
                    value={newNote.associatedWith?.id}
                    onChange={(e) => setNewNote({
                      ...newNote, 
                      associatedWith: {
                        id: e.target.value,
                        name: e.target.options[e.target.selectedIndex].text
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                  >
                    <option value="">Select a lesson</option>
                    <option value="lesson-1">Newton's Laws of Motion</option>
                    <option value="lesson-2">Energy and Work</option>
                    <option value="lesson-3">Waves and Oscillations</option>
                    <option value="lesson-4">Electricity and Magnetism</option>
                  </select>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                  placeholder="Enter note content"
                  rows={10}
                />
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNoteEditor(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassNotesManager;