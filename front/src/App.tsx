import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import './App.css';
import Auth from './user/pages/Auth';

import { AuthContext } from './shared/context/auth-context';
import useAuth from './shared/hooks/auth-hook';

const App = () => {
    const { login, logout, token, userId } = useAuth();

    let routes;

    if (token) {
        routes = (
            <>
                <Route path="/" Component={Users} />
                <Route path="/:userId/places" Component={UserPlaces} />
                <Route path="/place/new" Component={NewPlace} />
                <Route path="/place/:placeId" Component={UpdatePlace} /> {/* 주소가비슷해서 밑에 위치해야함 */}
                <Route path="*" element={<Navigate to="/" />} />
            </>
        );
    } else {
        routes = (
            <>
                <Route path="/" Component={Users} />
                <Route path="/:userId/places" Component={UserPlaces} />
                <Route path="/auth" Component={Auth} />
                <Route path="*" element={<Navigate to="/auth" />} />
            </>
        );
    }

    return (
        <AuthContext.Provider
            value={{ isLoggedIn: !!token, userId: userId, login: login, logout: logout, token: token }}
        >
            <Router>
                <MainNavigation />
                <main>
                    <Routes>{routes}</Routes>
                </main>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
