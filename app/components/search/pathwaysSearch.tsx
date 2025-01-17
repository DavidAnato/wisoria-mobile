import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import PathwayMiniCard from "../pathway/miniCard";
import { apiRequest } from "../../../utils/api";
import { Pathway } from "../../../utils/types";
import { API_URL } from "../../../env";

const PathwaysSearch = ({ query, category, level }: { query: string | null; category: string | null; level: string | null }) => {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPathways = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest({
          method: "GET",
          url: `/courses/pathways/search/?query=${query}&category=${category ?? ""}&level=${level ?? ""}`,
        });
        setPathways(response.data.results);
      } catch {
        setError("Failed to load pathways.");
      } finally {
        setLoading(false);
      }
    };

    if (query || category || level) fetchPathways();
  }, [query, category, level]);

  if (loading) return <ActivityIndicator size="large" color="#007bff" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <>
        <Text style={styles.resultsText}> {pathways.length} Parcours trouvé{pathways.length > 1 ? "s" : ""}</Text>
        <ScrollView style={styles.scrollContainer}>
        {pathways.length > 0 ? (
            pathways.map((pathway) => (
            <PathwayMiniCard
                key={pathway.id}
                id={pathway.id.toString()}
                title={pathway.title}
                category={pathway.category}
                image={API_URL + pathway.image ?? ""}
                description={pathway.short_description}
            />
            ))
        ) : (
            <Text style={styles.noResultsText}>Aucun parcours trouvé.</Text>
        )}
        </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, display: "flex", flexDirection: "row", flexWrap: "wrap" },
  errorText: { color: "red", textAlign: "center", marginVertical: 10 },
  noResultsText: { textAlign: "center", marginVertical: 10 },
  resultsText: { fontSize: 14, fontWeight: "bold", marginVertical: 10, marginLeft: 10 },
});

export default PathwaysSearch;
