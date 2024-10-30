import React from 'react';
import '../scss/ProfilePage.css'

function ProfilePage() {

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h1>Профиль пользователя</h1>
                {/*<p><strong>Фамилия:</strong> {user.surname}</p>*/}
                {/*<p><strong>Имя:</strong> {user.name}</p>*/}
                {/* Можно добавить больше информации о пользователе */}
            </div>
            {/*<button onClick={handleLogout}>Выйти</button>*/}
        </div>
    );
}

export default ProfilePage;
