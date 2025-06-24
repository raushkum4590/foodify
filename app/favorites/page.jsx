import FavoritesList from '../_components/FavoritesList';
import Header from '../_components/Header';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FavoritesList />
    </div>
  );
}
