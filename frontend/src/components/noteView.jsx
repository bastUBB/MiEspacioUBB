import { useState } from 'react';
import {
    ArrowLeft,
    Star,
    MessageCircle,
    Bookmark,
    Download,
    User,
    Calendar,
    Eye,
    ThumbsUp,
    ThumbsDown,
    Send,
    BookOpen,
    Tag,
    Award
} from 'lucide-react';

const NoteView = ({ note, onBack }) => {
    const [userRating, setUserRating] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(note.comments);

    const renderStars = (rating, interactive = false, onRate) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 cursor-pointer transition-colors ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'
                    }`}
                onClick={() => interactive && onRate && onRate(i + 1)}
            />
        ));
    };

    const handleRating = (rating) => {
        setUserRating(rating);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            const comment = {
                id: Date.now().toString(),
                author: 'Usuario Actual',
                content: newComment,
                date: new Date().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),
                likes: 0,
                dislikes: 0
            };
            setComments([comment, ...comments]);
            setNewComment('');
        }
    };

    const handleCommentVote = (commentId, type) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    likes: type === 'like' ? comment.likes + 1 : comment.likes,
                    dislikes: type === 'dislike' ? comment.dislikes + 1 : comment.dislikes
                };
            }
            return comment;
        }));
    };

    const formatContent = (content) => {
        const sections = content.split('\n\n');
        return sections.map((section, index) => {
            if (section.startsWith('# ')) {
                return (
                    <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                        {section.replace('# ', '')}
                    </h1>
                );
            } else if (section.startsWith('## ')) {
                return (
                    <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
                        {section.replace('## ', '')}
                    </h2>
                );
            } else if (section.startsWith('### ')) {
                return (
                    <h3 key={index} className="text-xl font-semibold text-gray-700 mb-3 mt-5">
                        {section.replace('### ', '')}
                    </h3>
                );
            } else if (section.startsWith('**') && section.endsWith('**')) {
                return (
                    <p key={index} className="font-semibold text-gray-800 mb-4 leading-relaxed">
                        {section.replace(/\*\*/g, '')}
                    </p>
                );
            } else {
                return (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed text-justify">
                        {section}
                    </p>
                );
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Explorar Apuntes</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                                ASIGUBB
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700">Estudiante</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Note Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                    {note.subject}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {note.title}
                            </h1>

                            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{note.author.name}</p>
                                            <div className="flex items-center space-x-1">
                                                <Award className="w-4 h-4 text-indigo-600" />
                                                <span className="text-sm text-indigo-600">{note.author.reputation} pts</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{note.uploadDate}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Download className="w-4 h-4" />
                                        <span>{note.downloads.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Eye className="w-4 h-4" />
                                        <span>{(note.downloads * 1.5).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                            {renderStars(note.rating)}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {note.rating.toFixed(1)} ({note.totalRatings} valoraciones)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {note.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
                                        >
                                            <Tag className="w-3 h-3" />
                                            <span>{tag}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-2 bg-yellow-50 rounded-lg p-3">
                                    <span className="text-sm font-medium text-gray-700">Valorar:</span>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(userRating, true, handleRating)}
                                    </div>
                                </div>

                                <button className="flex items-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Comentar</span>
                                </button>

                                <button
                                    onClick={handleBookmark}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${isBookmarked
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                    <span>Guardar</span>
                                </button>

                                <button className="flex items-center space-x-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                                    <Download className="w-4 h-4" />
                                    <span>Descargar PDF</span>
                                </button>
                            </div>
                        </div>

                        {/* Content Viewer */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contenido del Apunte</h2>
                            <div className="prose max-w-none">
                                {formatContent(note.content)}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Comentarios ({comments.length})
                            </h2>

                            {/* Add Comment */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Escribe tu comentario..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                            rows={3}
                                        />
                                        <div className="flex justify-end mt-3">
                                            <button
                                                onClick={handleCommentSubmit}
                                                disabled={!newComment.trim()}
                                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                            >
                                                <Send className="w-4 h-4" />
                                                <span>Publicar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-900">{comment.author}</span>
                                                    <span className="text-sm text-gray-500">{comment.date}</span>
                                                </div>
                                                <p className="text-gray-700">{comment.content}</p>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <button
                                                    onClick={() => handleCommentVote(comment.id, 'like')}
                                                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                    <span>{comment.likes}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleCommentVote(comment.id, 'dislike')}
                                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                                                >
                                                    <ThumbsDown className="w-4 h-4" />
                                                    <span>{comment.dislikes}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Author's Other Notes */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Otros apuntes del autor</h3>
                                <div className="space-y-3">
                                    {[
                                        { title: 'Álgebra Lineal Básica', subject: 'Matemáticas', rating: 4.8 },
                                        { title: 'Cálculo Integral', subject: 'Matemáticas', rating: 4.6 },
                                        { title: 'Ecuaciones Diferenciales', subject: 'Matemáticas', rating: 4.9 }
                                    ].map((item, i) => (
                                        <div key={i} className="border-l-4 border-purple-200 pl-3">
                                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-gray-500">{item.subject}</p>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                    <span className="text-xs text-gray-500">{item.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Related Notes */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Apuntes relacionados</h3>
                                <div className="space-y-3">
                                    {[
                                        { title: 'Límites y Continuidad', author: 'Pedro Martínez', rating: 4.5 },
                                        { title: 'Aplicaciones de Derivadas', author: 'Ana García', rating: 4.7 },
                                        { title: 'Teoremas Fundamentales', author: 'Luis Rodríguez', rating: 4.4 }
                                    ].map((item, i) => (
                                        <div key={i} className="border-l-4 border-violet-200 pl-3">
                                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-gray-500">{item.author}</p>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                    <span className="text-xs text-gray-500">{item.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteView;