import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "./ItineraryHistory.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendar, 
  faEye, 
  faList,
  faRoute,
  faCheck,
  faEuroSign
} from "@fortawesome/free-solid-svg-icons";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ItineraryHistory = () => {
  const [itineraries, setItineraries] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "itineraries"),
          where("userId", "==", auth.currentUser.uid),
        );
        const querySnapshot = await getDocs(q);
        const itinerariesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItineraries(itinerariesData);

        // Préparer les événements du calendrier
        const events = [];
        itinerariesData.forEach(itinerary => {
          itinerary.offers?.forEach(offer => {
            if (offer.date) {
              // Convertir la date Firestore en objet Date
              const date = offer.date.toDate();
              events.push({
                id: `${itinerary.id}-${offer.id}`,
                title: `${offer.name || offer.name_hotel || offer.name_restaurant || offer.name_activity || "Sans nom"} - ${itinerary.name || "Itinéraire sans nom"}`,
                start: date,
                end: date,
                allDay: true,
                resource: {
                  type: offer.type || 
                         (offer.name_hotel ? 'AccomodationPreferences' : 
                          offer.name_restaurant ? 'RestaurantPreferences' : 
                          'ActivityPreferences'),
                  itineraryId: itinerary.id,
                  price: offer.price || offer.budget || 0,
                  paid: itinerary.paid
                }
              });
            }
          });
        });
        console.log("Calendar events:", events); // Pour le débogage
        setCalendarEvents(events);
      }
    };

    fetchItineraries();
  }, []);

  const handleViewItinerary = (itineraryId) => {
    navigate(`/itinerary-review/${itineraryId}`);
  };

  const handleViewChange = (mode) => {
    console.log("Changing view to:", mode); // Pour le débogage
    setViewMode(mode);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#fe3c72';
    switch (event.resource.type) {
      case 'AccomodationPreferences':
        backgroundColor = '#4CAF50';
        break;
      case 'RestaurantPreferences':
        backgroundColor = '#FF9800';
        break;
      case 'ActivityPreferences':
        backgroundColor = '#2196F3';
        break;
      default:
        break;
    }
    
    return {
      style: {
        backgroundColor,
        opacity: event.resource.paid ? 1 : 0.7,
        border: 'none',
        borderRadius: '4px',
      }
    };
  };

  return (
    <div className={styles.itineraryHistory}>
      <header className={styles.header}>
        <h1>Mes Itinéraires</h1>
      </header>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <FontAwesomeIcon icon={faRoute} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{itineraries.length}</span>
            <span className={styles.statLabel}>Itinéraires créés</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <FontAwesomeIcon icon={faList} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {itineraries.reduce((sum, it) => sum + (it.offers?.length || 0), 0)}
            </span>
            <span className={styles.statLabel}>Offres réservées</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <FontAwesomeIcon icon={faCheck} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {itineraries.filter(it => it.paid).length}
            </span>
            <span className={styles.statLabel}>Itinéraires finalisés</span>
          </div>
        </div>
      </div>

      <div className={styles.viewToggleContainer}>
        <div className={styles.viewToggle}>
          <button 
            className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => handleViewChange('grid')}
          >
            <FontAwesomeIcon icon={faList} /> Vue liste
          </button>
          <button 
            className={`${styles.toggleButton} ${viewMode === 'calendar' ? styles.active : ''}`}
            onClick={() => handleViewChange('calendar')}
          >
            <FontAwesomeIcon icon={faCalendar} /> Vue calendrier
          </button>
        </div>
      </div>

      <main className={styles.mainContent}>
        {viewMode === 'calendar' ? (
          <div className={styles.calendarContainer}>
            <div className={styles.calendarLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: '#4CAF50'}}></span>
                <span>Hébergements</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: '#FF9800'}}></span>
                <span>Restaurants</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: '#2196F3'}}></span>
                <span>Activités</span>
              </div>
            </div>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              eventPropGetter={eventStyleGetter}
              culture="fr"
              messages={{
                next: "Suivant",
                previous: "Précédent",
                today: "Aujourd'hui",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                agenda: "Agenda",
                date: "Date",
                time: "Heure",
                event: "Événement",
                noEventsInRange: "Aucun événement dans cette période"
              }}
              onSelectEvent={(event) => handleViewItinerary(event.resource.itineraryId)}
            />
          </div>
        ) : itineraries.length === 0 ? (
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faRoute} className={styles.emptyIcon} />
            <h2>Aucun itinéraire créé</h2>
            <p>Commencez par liker des offres et créer votre premier itinéraire !</p>
          </div>
        ) : (
          <div className={styles.itineraryGrid}>
            {itineraries.map((itinerary) => (
              <div key={itinerary.id} className={styles.itineraryCard}>
                <div className={styles.cardHeader}>
                  <h2>{itinerary.name || "Itinéraire sans nom"}</h2>
                  {itinerary.paid && (
                    <span className={styles.statusTag}>Finalisé</span>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardDetail}>
                    <FontAwesomeIcon icon={faCalendar} className={styles.icon} />
                    <span>Créé le {itinerary.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>

                  <div className={styles.cardDetail}>
                    <FontAwesomeIcon icon={faList} className={styles.icon} />
                    <span>{itinerary.offers?.length || 0} offres</span>
                  </div>

                  <div className={styles.cardDetail}>
                    <FontAwesomeIcon icon={faEuroSign} className={styles.icon} />
                    <span>
                      {itinerary.offers?.reduce((sum, offer) => sum + (offer.price || offer.budget || 0), 0)}€
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewItinerary(itinerary.id)}
                  className={styles.viewButton}
                >
                  <FontAwesomeIcon icon={faEye} /> Voir le détail
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ItineraryHistory;
