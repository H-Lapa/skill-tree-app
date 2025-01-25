import { useEffect, useState } from 'react';
import { auth } from '../../../../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

export default function UserProfile() {
  const [displayName, setDisplayName] = useState('');
  
  useEffect(() => {
    if (auth.currentUser?.displayName) {
      setDisplayName(auth.currentUser.displayName);
    }
  }, []);

  const updateUserProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      // Sync with Firestore
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName,
        email: auth.currentUser.email,
        lastLogin: new Date()
      }, { merge: true });
      
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  return (
    <div>
      <input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display Name"
      />
      <button onClick={updateUserProfile}>Update Profile</button>
    </div>
  );
}