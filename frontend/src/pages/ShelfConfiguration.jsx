import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/shelfConfiguration.module.css";
import ConfigurationCompartment from "../components/Shelf/ConfigurationCompartment";
import EditConfigurationShelf from "../components/Shelf/EditConfigurationShelf";
import { useConfig } from "../ConfigProvider";
import toast from "react-hot-toast";

const TOTAL_HEIGHT = 200; // Gesamtregalhöhe in cm
const DISPLAY_HEIGHT = 1000; // Anzeigehöhe in Pixeln
const LED_COUNT = 120; // Gesamtanzahl der LEDs entlang des Regals
const MIN_LEDS_PER_SHELF = 4; // Mindestanzahl der LEDs pro Fach
const MIN_SHELF_HEIGHT_CM = 5.5; // Mindesthöhe pro Fach in cm

const PIXELS_PER_CM = DISPLAY_HEIGHT / TOTAL_HEIGHT;
const STEP_PIXELS = PIXELS_PER_CM * MIN_SHELF_HEIGHT_CM; // Schrittgröße in Pixel für 5,5 cm Schritte

const ShelfConfiguration = () => {
    const [shelves, setShelves] = useState([{ height: STEP_PIXELS, leds:4 }]);
    const [activeShelves, setActiveShelves] = useState([]);
    const [place, setPlace] = useState();
    const [shelfName, setShelfName] = useState();
    const [numberLed, setNumberLed] = useState(0);
    const navigate = useNavigate();
    const config = useConfig();
    const { backendUrl } = config || {};

    const createShelf = async () => {
        const updatedShelves = shelves.map((shelf) => ({
            ...shelf,
            height: shelf.height, // heigth in pixle
        }));
    
        return await fetch(`http://${backendUrl === undefined ? config.localhost : backendUrl}:3000/createShelf`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-cache",
            body: JSON.stringify({
                shelfname: shelfName,
                shelfPlace: place,
                CountCompartment: shelves.length,
                shelves: updatedShelves,
            }),
        }).then((result) => {
            if (result.status === 200) {
                toast.success("Ein neues Regal wurde erstellt");
                navigate("/regale");
            } else {
                toast.error("Es konnte kein Regal erstellt werden");
            }
        });
    };
    const handleShelfChange = (index, height) => {
        const roundedHeight = Math.round(height / STEP_PIXELS) * STEP_PIXELS;
        const leds = calculateLEDs(roundedHeight);
    
        setShelves((prevShelves) => {
            const newShelves = [...prevShelves];
            newShelves[index] = { height: roundedHeight, leds };
            return calculateLEDRange(newShelves);
        });
    };
    const toggleEditing = (index) => {
        setActiveShelves((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };
    const addShelf = () => {
        setShelves((prevShelves) => {
            const newShelves = [
                ...prevShelves,
                { height: STEP_PIXELS, leds: calculateLEDs(STEP_PIXELS) }
            ];
            return calculateLEDRange(newShelves);
        });
    };
    const removeShelf = (index) => {
        setShelves((prevShelves) => prevShelves.filter((_, i) => i !== index));
        setActiveShelves((prev) => prev.filter((i) => i !== index));
    };
    const calculateLEDs = (height) => {
        const leds = Math.round((height / DISPLAY_HEIGHT) * LED_COUNT);
        return Math.max(leds, MIN_LEDS_PER_SHELF);
    };
    const countNumberLeds = () => {
        const totalLeds = shelves.reduce((acc, shelf) => acc + shelf.leds, 0);
        setNumberLed(totalLeds); 
    };
    const calculateLEDRange = (shelves) => {
        let currentLED = 0;
        let startLED;
        let endLED;
        return shelves.map((shelf) => {
            const leds = calculateLEDs(shelf.height);
            if (currentLED === 0) {                
                startLED = currentLED;
                endLED = startLED + leds;
                currentLED = endLED + 1;
            }else{
                startLED = currentLED -1;
                endLED = startLED + leds;
                currentLED = endLED + 1;
            }
            return { ...shelf, startLED, endLED };
        });
    };
    const calculateShelfHeightPercentage = (height) => {
        return (height / DISPLAY_HEIGHT) * 100;
    };

    useEffect(() => {
        countNumberLeds();
    }, [shelves, shelfName, place, numberLed]);

    return (
        <div className={styles.contentContainer}>
            <h2 style={{marginLeft:"1rem"}}>Regal Konfiguration</h2>
            <div className={styles.createContainer}>
            <button 
                className={(shelfName && place) ? "primaryButton" : "disabledButton"} 
                onClick={createShelf} 
                disabled={!(shelfName && place)}
            >
                Regal erstellen
            </button>
                <input className={styles.inputCreate} type="text" placeholder="Regalname" onChange={(e)=>setShelfName(e.target.value)}/>
                <input className={styles.inputCreate} type="text" placeholder="Ort" onChange={(e)=>setPlace(e.target.value)}/>
            </div>

            <div className={styles.shelfContainer}>
                {/* Schrank-Darstellung */}
                <div className={styles.shelfDisplay} style={{
                    width: "300px",
                    height: `${DISPLAY_HEIGHT}px`,
                    border: "3px solid #000",
                    backgroundColor: "#f9f9f9",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    background: "White",
                    overflowY: "auto"
                }}>
                    <div className={styles.shelfHeader}>{shelfName}</div>
                    {shelves.map((shelf, index) => (
                        <ConfigurationCompartment 
                            key={index}
                            shelf={shelf} 
                            index={index}
                            isEditing={activeShelves.includes(index)}
                            toggleEditing={() => toggleEditing(index)}
                            handleShelfChange={handleShelfChange}                            
                            calculateLEDs={calculateLEDs}
                            calculateShelfHeightPercentage={calculateShelfHeightPercentage(shelf.height)}                            
                        />
                    ))}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                        {numberLed < 120 && <button className={styles.addCompartmentButton} onClick={addShelf}>+</button>}
                    </div>
                </div>
                
                <div className={styles.editContainer}>
                    {/* Zeigt EditConfigurationShelf für alle aktiven Fächer an */}
                    {activeShelves.map((index) => {
                        const shelf = shelves[index];
                        if (!shelf) return null;

                        return (
                            <EditConfigurationShelf 
                                key={index} 
                                currentCompartment={index}
                                height={shelf.height / PIXELS_PER_CM}
                                onHeightChange={(compartmentIndex, newHeight) => 
                                    handleShelfChange(compartmentIndex, newHeight * PIXELS_PER_CM)
                                }
                                numberLed={numberLed}
                                removeShelf={() => removeShelf(index)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ShelfConfiguration;
