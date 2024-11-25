import React, { useState, useEffect } from "react";
import ConfigurationCompartment from "../components/Shelf/ConfigurationCompartment";
import EditConfigurationShelf from "../components/Shelf/EditConfigurationShelf";
import styles from "../styles/editShelfLayout.module.css";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useConfig } from "../ConfigProvider";

const TOTAL_HEIGHT = 200; // Gesamtregalhöhe in cm
const DISPLAY_HEIGHT = 1000; // Anzeigehöhe in Pixeln
const LED_COUNT = 120; // Gesamtanzahl der LEDs entlang des Regals
  const MAX_LED_COUNT = 120; // Maximale LEDs
const PIXELS_PER_CM = DISPLAY_HEIGHT / TOTAL_HEIGHT;

const EditShelfLayout = () => {
    const { shelfid } = useParams();
    const [shelves, setShelves] = useState([]);
    const [activeShelves, setActiveShelves] = useState([]);
    const [numberLed, setNumberLed] = useState(0);
    const [shelfName, setShelfName] = useState();
    const [newShelfname, setNewShelfname] = useState();
    const [newPlace, setNewPlace] = useState();
    const [place, setPlace] = useState();
    const navigate = useNavigate();
    const config = useConfig();
    const { backendUrl } = config || {};

    const updateShelf = async () => {
        try {

            const updatedShelves = shelves.map((shelf) => ({
                ...shelf,
                height: shelf.height,
            }));

            await fetch(`http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/updateShelf`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    cache: "no-cache",
                    body: JSON.stringify({
                        shelfid: shelfid,
                        shelfname: newShelfname !== undefined ? newShelfname : shelfName,
                        shelfPlace: newPlace !== undefined ? newPlace : place,
                        countCompartment: shelves.length,
                        shelves: updatedShelves,
                    }),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.serverStatus === 1) {
                        toast.success("Regal wurde aktualisiert");
                        navigate("/regale");
                    }
                    else{
                        toast.error("Regal konnte nicht aktualsiert werden.");
                    }
                });
        } catch (error) {
            toast.error("Regal konnte nicht aktualisiert werden.");
            console.log("Fehler beim update des Regals: ", error);
        }

    };
    const deleteCompartment = async (index, compartmentId) => {
        if (compartmentId !== undefined) {
            try {
                await fetch(`http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/deleteCompartment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    cache: "no-cache",
                    body: JSON.stringify({
                        compartmentId
                    }),
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.serverStatus === 1) {
                        setShelves((prevShelves) => {
                            const updatedShelves = prevShelves.filter((_, i) => i !== index);
    
                            // Neu nummerieren, damit die Reihenfolge stimmt
                            updatedShelves.forEach((shelf, index) => {
                                shelf.number = index + 1;
                                shelf.compartmentname = `${shelf.number}-Fach`;
                            });
    
                            calculateLEDsForShelves(updatedShelves);
                            return updatedShelves;
                        });
                        toast.success("Fach wurde entfernt");
                        toggleEditing(index);
                    }
                });
            } catch (error) {
                toast.error("Fach konnte nicht gelöscht werden");
            }
        }
    };
    const calculateLEDsForShelves = (updatedShelves) => {
        const totalLeds = updatedShelves.reduce((acc, shelf) => acc + shelf.leds, 0);
        setNumberLed(totalLeds);
    };
    const getShelf = async () => {
        try {
            await fetch(
                `http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/getShelfConfig`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    cache: "no-cache",
                    body: JSON.stringify({ shelfid }),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    const sortedCompartments = data.data.sort((a, b) => a.number - b.number);
                    setShelfName(data.data[0].shelfname);
                    setPlace(data.data[0].place);

                    const updatedShelves = sortedCompartments.map((comp) => ({
                        ...comp,
                        leds: Math.round((comp.height / DISPLAY_HEIGHT) * LED_COUNT)
                    }));

                    setShelves(updatedShelves);
                    calculateLEDsForShelves(updatedShelves);
                });
        } catch (error) {
            toast.error("Serverfehler: ", error);
            console.log(error);
        }
    };
    const handleShelfChange = (index, height) => {
        const roundedHeight = Math.round(height / (PIXELS_PER_CM * 5.5)) * (PIXELS_PER_CM * 5.5); // Höhe auf ein multiples von 5,5 cm runden
        const leds = Math.round((roundedHeight / DISPLAY_HEIGHT) * LED_COUNT);  // LEDs auf Basis der Höhe berechnen
    
        setShelves((prevShelves) => {
            const updatedShelves = [...prevShelves];
            updatedShelves[index] = { 
                ...updatedShelves[index], 
                height: roundedHeight,
                startLed: prevShelves.slice(0, index).reduce((acc, shelf) => acc + shelf.leds, 0) + 1,  // Start-LED berechnen
                endLed: prevShelves.slice(0, index).reduce((acc, shelf) => acc + shelf.leds, 0) + leds,  // End-LED berechnen
            };
            calculateLEDsForShelves(updatedShelves);  // Gesamt-LEDs berechnen
            return updatedShelves;
        });
    };
    const toggleEditing = (index) => {
        setActiveShelves((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };
    const addShelf = () => {
        const newShelfLEDs = Math.round((PIXELS_PER_CM * 5.5 / DISPLAY_HEIGHT) * LED_COUNT);
        if (numberLed + newShelfLEDs > MAX_LED_COUNT) {
            toast.error("Maximale Anzahl von 120 LEDs erreicht.");
            return;
        }
    
        setShelves((prevShelves) => {
            const updatedShelves = [
                ...prevShelves,
                { height: PIXELS_PER_CM * 5.5, leds: newShelfLEDs }
            ];
    
            updatedShelves.forEach((shelf, index) => {
                shelf.number = index + 1;  // Ordne jedem Fach eine fortlaufende Nummer zu
                shelf.compartmentname = `${shelf.compartmentNumber}-Fach`;  // Setze den Namen
            });
    
            calculateLEDsForShelves(updatedShelves);
            return updatedShelves;
        });
    };
    
    useEffect(() => {
        getShelf();
    }, [shelfid]);

    return (
        <div className={styles.contentContainer}>
            <h2>Regal {shelfName} bearbeiten</h2>
            <div className={styles.shelfPropertiesContainer}>
                <button className="primaryButton" onClick={()=>updateShelf()}>Speichern</button>
                <input type="text" className={styles.inputText} placeholder={`(Name) ${shelfName}`} onChange={(e)=>setNewShelfname(e.target.value)}/>
                <input type="text" className={styles.inputText} placeholder={`(Ort) ${place}`} onChange={(e)=>setNewPlace(e.target.value)}/>
            </div>
            <div className={styles.shelfContainer}>
                {/* Regal-Darstellung */}
                <div
                    className={styles.shelfDisplay}
                    style={{
                        width: "300px",
                        height: `${DISPLAY_HEIGHT}px`,
                        border: "3px solid #000",
                        backgroundColor: "#f9f9f9",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    {shelves.map((shelf, index) => (
                        <ConfigurationCompartment
                            key={index}
                            shelf={shelf}
                            index={index}
                            isEditing={activeShelves.includes(index)}
                            toggleEditing={() => toggleEditing(index)}
                            handleShelfChange={handleShelfChange}
                            calculateLEDs={(height) => Math.round((height / DISPLAY_HEIGHT) * LED_COUNT)}
                            calculateShelfHeightPercentage={(height) => (height / DISPLAY_HEIGHT) * 100}
                            numberled={shelf.countLed}
                        />
                    ))}
                    {numberLed < MAX_LED_COUNT && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                            <button
                                className={styles.addCompartmentButton}
                                onClick={addShelf}
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
                <div className={styles.editContainer}>
                    {/* Editierungsbereich für aktive Fächer */}
                    {activeShelves.map((index) => (
                        <EditConfigurationShelf
                            key={index}
                            currentCompartment={index}
                            height={shelves[index].height / PIXELS_PER_CM}
                            onHeightChange={(compartmentIndex, newHeight) =>
                                handleShelfChange(compartmentIndex, newHeight * PIXELS_PER_CM)
                            }
                            removeShelf={()=>deleteCompartment(index, shelves[index].compartmentId)}
                            numberLed={numberLed}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditShelfLayout;
