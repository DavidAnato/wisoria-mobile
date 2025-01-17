import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, ToastAndroid, Text, StyleSheet, Linking, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { apiFormDataRequest } from '../../utils/api';
import Header from '../components/utils/header';
import Background from '../components/utils/background';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const Certificate = ({ route }: { route: any }) => {
    const { courseId, pathwayId } = route.params;
    const [certificatePDFUrl, setCertificatePDFUrl] = useState<string | null>(null);
    const [certificatePNGUrl, setCertificatePNGUrl] = useState<string | null>(null);
    const [showCertificate, setShowCertificate] = useState<boolean>(false);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                // Requête API pour récupérer l'URL du certificat
                const response = await apiFormDataRequest({
                    method: 'GET',
                    url: `/certification/${pathwayId ? `pathway/${pathwayId}` : `course/${courseId}`}/certificate`,
                });

                if (response && response.data && response.data.certificate_pdf_url && response.data.certificate_png_url) {
                    setCertificatePDFUrl(response.data.certificate_pdf_url);
                    setCertificatePNGUrl(response.data.certificate_png_url);
                    ToastAndroid.show('Certificat chargé avec succès.', ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show('Le certificat n\'est pas disponible.', ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error('Erreur de téléchargement du certificat:', error);
                ToastAndroid.show('Une erreur est survenue lors du téléchargement.', ToastAndroid.SHORT);
            }
        };

        fetchCertificate();
    }, [courseId]);

    const handleDownload = () => {
        if (certificatePDFUrl) {
            // Utiliser Linking pour ouvrir l'URL dans un navigateur
            Linking.openURL(certificatePDFUrl)
                .catch(() => ToastAndroid.show('Impossible d\'ouvrir le certificat.', ToastAndroid.SHORT));
        }
    };

    // Gérer le back press pour revenir à l'écran précédent
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                setShowCertificate(false);
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => {
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            };
        }, [])
    );

    if (showCertificate) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <TouchableOpacity style={{ marginTop: 20, marginLeft: 20 }} onPress={() => setShowCertificate(false)}>
                    <MaterialCommunityIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <WebView
                    source={{ uri: certificatePNGUrl|| '' }}
                    style={{ flex: 1 }}
                    forceDarkOn={true}
                    setBuiltInZoomControls={true}
                    scalesPageToFit={true} // S'assure que la page s'adapte à l'écran
                    allowsInlineMediaPlayback={true} // Autorise la lecture des médias intégrés
                    onError={() => ToastAndroid.show('Erreur lors de l\'affichage du certificat.', ToastAndroid.SHORT)}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Background />
            <Header title="Certificat" backEnabled={true} homeEnabled={true} />
            {certificatePNGUrl ? (
                <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => setShowCertificate(true)} // Corrigé en ajoutant une fonction fléchée
                        activeOpacity={0.8}
                        style={{ height: 212, width: 300, aspectRatio: 1.42, marginTop: -200}}
                    >
                        <WebView
                            source={{ uri: certificatePNGUrl }}
                            forceDarkOn={true}
                            setBuiltInZoomControls={true}
                            scalesPageToFit={true} // S'assure que la page s'adapte à l'écran
                            allowsInlineMediaPlayback={true} // Autorise la lecture des médias intégrés
                            onError={() => ToastAndroid.show('Erreur lors de l\'affichage du certificat.', ToastAndroid.SHORT)}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.downloadButton} onPress={handleDownload} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="download" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Télécharger le certificat</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text style={styles.message}>Chargement du certificat...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    downloadButton: {
        backgroundColor: '#0056D2',
        padding: 15,
        margin: 10,
        borderRadius: 30,
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    message: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        color: '#6c757d',
    },
});

export default Certificate;
