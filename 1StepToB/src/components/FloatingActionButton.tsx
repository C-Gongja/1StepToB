import React from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Animated,
} from 'react-native';

interface FloatingActionButtonProps {
	onPress: () => void;
	icon?: string;
	size?: number;
	backgroundColor?: string;
	bottom?: number;
	right?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = React.memo(({
	onPress,
	icon = '+',
	size = 56,
	backgroundColor = '#007AFF',
	bottom = 10,
	right = 20,
}) => {
	const scaleAnim = React.useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.9,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Animated.View
			style={[
				styles.container,
				{
					width: size,
					height: size,
					borderRadius: size / 2,
					backgroundColor,
					bottom,
					right,
					transform: [{ scale: scaleAnim }],
				}
			]}
		>
			<TouchableOpacity
				style={styles.button}
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				activeOpacity={0.8}
			>
				<Animated.Text style={[styles.icon, { fontSize: size * 0.4 }]}>
					{icon}
				</Animated.Text>
			</TouchableOpacity>
		</Animated.View>
	);
});

export default FloatingActionButton;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		zIndex: 1000,
	},
	button: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	icon: {
		color: '#fff',
		fontWeight: '300',
		lineHeight: undefined,
	},
});