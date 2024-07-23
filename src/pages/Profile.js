import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import './profile.css';

const Profile = ({ authenticatedUser }) => {
  console.log(authenticatedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [formData, setFormData] = useState(authenticatedUser ? { ...authenticatedUser } : {});
  const defaultImage = 'img/pfp.jpg';
  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

  useEffect(() => {
    if (authenticatedUser) {
      const fetchProfile = async () => {
        const db = getFirestore();
        const userRef = doc(db, "Ball", authenticatedUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists() && !isEditClicked) {
          const data = docSnap.data();
          console.log(data);
          setFormData({
            ...data,
            team: data.team || null,
            position: data.position || [],
            height: data.height || '',
            weight: data.weight || '',
            wingspan: data.wingspan || '',
            games: data.games || 0,
            points: data.points || 0,
            assists: data.assists || 0,
            rebounds: data.rebounds || 0,
            steals: data.steals || 0,
            blocks: data.blocks || 0,
            phone: data.phone || '',
            img: data.img || defaultImage,
          });
        }
      };

      fetchProfile();
    }
  }, [authenticatedUser, isEditClicked]);

  if (!authenticatedUser) {
    return <Navigate to="/signin" />;
  }

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'position') {
      const updatedPositions = checked
        ? [...(formData.position || []), value]
        : (formData.position || []).filter((pos) => pos !== value);
      setFormData({
        ...formData,
        [name]: updatedPositions,
      });
    } else {
      setFormData({
        ...formData,
        [name]: e.target.type === 'number' ? Number(value) : value,
      });
    }
  };

  const saveProfile = async () => {
    const db = getFirestore();
    const userRef = doc(db, "Ball", authenticatedUser.uid);
    const userData = {
      ...formData,
      team: formData.team,
      position: formData.position,
      height: formData.height,
      weight: formData.weight,
      wingspan: formData.wingspan,
      games: formData.games,
      points: formData.points,
      assists: formData.assists,
      rebounds: formData.rebounds,
      steals: formData.steals,
      blocks: formData.blocks,
      phone: formData.phone,
      img: formData.img || defaultImage,
    };
  
    try {
      await setDoc(userRef, userData); // Use setDoc to update the document
      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile: ", error);
    }
  };

  const handleSave = async () => {
    await saveProfile();
    setIsEditing(false);
    setIsEditClicked(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(authenticatedUser);
    setIsEditClicked(false);
  };

  return (
    <div className='profile'>
      {isEditing ? (
        <form>
          <section className="profile-pic">
            <img
              src={formData.img || defaultImage}
              alt={`${formData.firstName}`}
              style={{ width: '200px', height: '200px' }}
            />
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
          </section>

          <section className="position">
            <h1>Position</h1>
            {positions.map((pos) => (
              <label key={pos}>
                <input
                  type="checkbox"
                  name="position"
                  value={pos}
                  checked={Array.isArray(formData.position) ? formData.position.includes(pos) : false}
                  onChange={handleInputChange}
                />
                {pos}
              </label>
            ))}
          </section>

          <section className="location">
            <h2>Location</h2>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              placeholder="State"
            />
            <input
              type="text"
              name="county"
              value={formData.county || ''}
              onChange={handleInputChange}
              placeholder="County"
            />
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              placeholder="City"
            />
          </section>

          <section className="bio">
            <h3>Basketball Experience</h3>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
            />
          </section>

          <section className="bio-data">
            <h3>Height (in)</h3>
            <input
              type="number"
              name="height"
              value={formData.height || ''}
              onChange={handleInputChange}
            />
            <h3>Weight (lb)</h3>
            <input
              type="number"
              name="weight"
              value={formData.weight || ''}
              onChange={handleInputChange}
            />
            <h3>Wingspan (in)</h3>
            <input
              type="number"
              name="wingspan"
              value={formData.wingspan || ''}
              onChange={handleInputChange}
            />
          </section>

          <section className="stats">
            <h3>Statistics</h3>
            <ul>
              <li>
                Games played:
                <input
                  type="number"
                  name="games"
                  value={formData.games}
                  onChange={handleInputChange}
                />
              </li>
              <li>
                Points per game:
                <input
                  type="number"
                  name="points"
                  value={formData.points || ''}
                  onChange={handleInputChange}
                />
              </li>
              <li>
                Assists per game:
                <input
                  type="number"
                  name="assists"
                  value={formData.assists || ''}
                  onChange={handleInputChange}
                />
              </li>
              <li>
                Rebounds per game:
                <input
                  type="number"
                  name="rebounds"
                  value={formData.rebounds || ''}
                  onChange={handleInputChange}
                />
              </li>
              <li>
                Steals per game:
                <input
                  type="number"
                  name="steals"
                  value={formData.steals || ''}
                  onChange={handleInputChange}
                />
              </li>
              <li>
                Blocks per game:
                <input
                  type="number"
                  name="blocks"
                  value={formData.blocks || ''}
                  onChange={handleInputChange}
                />
              </li>
            </ul>
          </section>

          <section className="contact-info">
            <h3>Contact Information</h3>
            <p>Email: {formData.email}</p>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="Phone"
            />
          </section>

          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <section className="profile-pic">
            <img
              src={formData.img || defaultImage}
              alt={`${formData.firstName}`}
              style={{ width: '200px', height: '200px' }}
            />
          </section>

          <section className="position">
            <h2>Position</h2>
            <p>{Array.isArray(formData.position) ? formData.position.join(', ') : formData.position || 'Not Provided'}</p>
          </section>

          <section className="location">
            <h2>Location</h2>
            <p>State: {formData.state || 'Not Provided'}</p>
            <p>County: {formData.county || 'Not Provided'}</p>
            <p>City: {formData.city || 'Not Provided'}</p>
          </section>

          <section className="bio">
            <h2>Basketball Experience</h2>
            <p>{formData.experience || 'Not Provided'}</p>
          </section>

          <section className="bio-data">
            <h2>Height</h2>
            <p>{formData.height || 'Not Provided'}</p>
            <h2>Weight</h2>
            <p>{formData.weight || 'Not Provided'}</p>
            <h2>Wingspan</h2>
            <p>{formData.wingspan || 'Not Provided'}</p>
          </section>

          <section className="stats">
            <h2>Statistics</h2>
            <ul>
              <li>Games played: {formData.games || 0}</li>
              <li>Total Points: {formData.points || 0}</li>
              <li>Total Assists: {formData.assists || 0}</li>
              <li>Total Rebounds: {formData.rebounds || 0}</li>
              <li>Total Steals: {formData.steals || 0}</li>
              <li>Total Blocks: {formData.blocks || 0}</li>
            </ul>
          </section>

          <section className="contact-info">
            <h2>Contact Information</h2>
            <p>Email: {formData.email}</p>
            <p>Phone: {formData.phone || 'Not Provided'}</p>
          </section>

          <button
            className="edit"
            onClick={() => {
              setIsEditing(true);
              setIsEditClicked(true);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;