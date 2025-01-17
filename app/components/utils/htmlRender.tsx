import RenderHtml from 'react-native-render-html';
import { Dimensions, StyleSheet } from 'react-native';

const HtmlRender = ({ description }: { description: any }) => {
    const screenWidth = Dimensions.get('window').width;

    return (
        <RenderHtml
          contentWidth={screenWidth}
          source={{ html: description }}
          baseStyle={styles.description}
          tagsStyles={{
            pre: { backgroundColor: '#000', color: '#fff' },
            code: { fontFamily: 'monospace', color: '#d63384' },
            h1: { fontSize: 20, fontWeight: 'bold', marginBottom: 0 },
            h2: { fontSize: 18, fontWeight: 'bold', marginBottom: 0 },
            h3: { fontSize: 16, fontWeight: 'bold', marginBottom: 0 },
          }}
        />
    );
};


const styles = StyleSheet.create({
    description: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
});

export default HtmlRender;