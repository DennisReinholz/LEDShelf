import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadConfig() {
            try {
                const response = await fetch("/src/config.json");
                if (!response.ok) {
                    setConfig({ localhost: "http://localhost" });
                } else {
                    const data = await response.json();
                    if (data.prod) {
                        setConfig(data.backendUrl);
                    }
                    else{
                        setConfig({localhost: "localhost"});
                    }                  
                }
            } catch (err) {
                console.error("Error loading config: First start LedShelf in DockerContainer", err);
                setConfig({ localhost: "http://localhost" });
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadConfig();
    }, []);
    
    if (loading) {
        return <div>Lade Konfiguration...</div>;
    }

    if (error) {
        return <div>Error loading configuration: {error.message}</div>;
    }

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

// Definiere die Prop-Typen für den ConfigProvider
ConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom Hook zum Verwenden des Kontexts
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};