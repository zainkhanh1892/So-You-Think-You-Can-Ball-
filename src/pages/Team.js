import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, where, query, collection } from "firebase/firestore";
import './team.css';

const Team = ({ data, currentTeam, setCurrentTeam, authenticatedUser }) => {
  const [teamName, setTeamName] = useState(currentTeam);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (authenticatedUser) {
      const fetchProfile = async () => {
        try {
          const db = getFirestore();
          const userRef = doc(db, 'Ball', authenticatedUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log('Authenticated user data:', userData);
            setUserData(userData);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching authenticated user data:', error);
        }
      };

      fetchProfile();
    }
  }, [authenticatedUser]);
  
  const updateUserTeam = async (userId, newTeamName) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "Ball", userId);
      const docSnapshot = await getDoc(userRef);

      if (docSnapshot.exists()) {
        await updateDoc(userRef, { team: newTeamName });
        console.log("Team updated successfully!");
      } else {
        await setDoc(userRef, { team: newTeamName });
        console.log("Team created successfully!");
      }
    } catch (error) {
      console.error("Error updating/creating team: ", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (userData) {
      await updateUserTeam(userData.uid, teamName);
      setIsEditing(false);
      setCurrentTeam(teamName);
    }
  };

  const handleChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleLeaveTeam = async () => {
    const confirmation = window.confirm("Are you sure you want to leave the team?");
    if (confirmation) {
      try {
        const db = getFirestore();
        const userRef = doc(db, "Ball", userData.uid);
  
        await updateDoc(userRef, { team: null });
        setCurrentTeam(null);
        console.log("Left team successfully!");
      } catch (error) {
        console.error("Error leaving team: ", error);
      }
    }
  };
  console.log("CURRENT TEAM DISPLAYED IN TEAM.js", currentTeam);
  const teamMembers = data.filter(profileObj => profileObj.team === currentTeam);

  const fetchInvitations = async (userId) => {
    console.log(userId);
    try {
      const db = getFirestore();
      const invitesRef = collection(db, "Invites");
      const querySnapshot = await getDocs(query(invitesRef, where("receiverId", "==", userId)));
      const invitations = [];
      querySnapshot.forEach((doc) => {
        invitations.push({ id: doc.id, ...doc.data() });
      });
      return invitations;
    } catch (error) {
      console.error("Error fetching invitations: ", error);
      return [];
    }
  };  
  
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    if (userData) {
      fetchInvitations(userData.uid).then((invitations) => {
        setInvitations(invitations);
      });
    }
  }, [userData]);
  console.log(invitations);

  const handleAcceptInvitation = async (invitation) => {
    try {
      const db = getFirestore();
      const inviteRef = doc(db, "Invites", invitation.id);
      const inviteData = (await getDoc(inviteRef)).data();
      const { receiverId, teamName } = inviteData;
  
      await updateUserTeam(receiverId, teamName);
      await updateDoc(inviteRef, { status: "accepted" });
      await deleteDoc(inviteRef);
  
      console.log("Invitation accepted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error accepting invitation: ", error);
    }
  };
  
  
  const handleDeclineInvitation = async (invitation) => {
    try {
      const db = getFirestore();
      const inviteRef = doc(db, "Invites", invitation.id);
  
      await updateDoc(inviteRef, { status: "declined" });
      await deleteDoc(inviteRef);
      setInvitations(prevInvitations => 
        prevInvitations.filter(inv => inv.id !== invitation.id)
      );
     
  
      console.log("Invitation declined successfully!");
    } catch (error) {
      console.error("Error declining invitation: ", error);
    }
  };

  return (
    <div className='team'>
      {invitations.length > 0 && userData.team == null && (
      <div className="invitations">
        <h1>Invitations</h1>
        <ul>
          {invitations.map((invitation) => (
            <li key={invitation.id}>
              <p>From: {invitation.senderUser} ({invitation.teamName})</p>
              <p>Status: {invitation.status}</p>
              {/* Add buttons to accept or decline the invitation */}
              <button onClick={() => handleAcceptInvitation(invitation)}>Accept</button>
              <button onClick={() => handleDeclineInvitation(invitation)}>Decline</button>
            </li>
          ))}
        </ul>
      </div>
    )}
      <div className="noTeam">
        {currentTeam ? (
          <div className='team-header'>
            <h1>Your team: {currentTeam}</h1>
          </div>
        ) : (
          <div className='team-header'>
            <h2>You don't have a team yet.</h2>
            {isEditing ? (
              <div>
                <input type="text" value={teamName} onChange={handleChange} />
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <button className="createTeamBtn" onClick={handleEdit}>Create a team</button>
            )}

            <h2 className='freeAgentsTitle'>Free Agents:</h2>
          </div>
        )}

        <div className="table-responsive">
          <table className="table w-100">
            <thead>
              <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Position</th>
              <th className="text-center">PPG</th>
              <th className="text-center">AST</th>
              <th className="text-center">REB</th>
              <th className="text-center">STL</th>
              <th className="text-center">BLK</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((profileObj) => (
                <tr key={profileObj.username}>
                <td>{`${profileObj.firstName} ${profileObj.lastName}`}</td>
                <td className="text-center">{profileObj.email}</td>
                <td className="text-center">{Array.isArray(profileObj.position) ? profileObj.position.join(', ') : profileObj.position || 'N/A'}</td>
                <td className="text-center">{profileObj.games ? (profileObj.points && profileObj.games ? (profileObj.points / profileObj.games).toFixed(1) : 'N/A') : 'N/A'}</td>
                <td className="text-center">{profileObj.games ? (profileObj.assists && profileObj.games ? (profileObj.assists / profileObj.games).toFixed(1) : 'N/A') : 'N/A'}</td>
                <td className="text-center">{profileObj.games ? (profileObj.rebounds && profileObj.games ? (profileObj.rebounds / profileObj.games).toFixed(1) : 'N/A') : 'N/A'}</td>
                <td className="text-center">{profileObj.games ? (profileObj.steals && profileObj.games ? (profileObj.steals / profileObj.games).toFixed(1) : 'N/A') : 'N/A'}</td>
                <td className="text-center">{profileObj.games ? (profileObj.blocks && profileObj.games ? (profileObj.blocks / profileObj.games).toFixed(1) : 'N/A') : 'N/A'}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentTeam && (
          <div className="leaveTeamButtonContainer">
            <button className="leaveTeamBtn" onClick={handleLeaveTeam}>Leave Team</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;