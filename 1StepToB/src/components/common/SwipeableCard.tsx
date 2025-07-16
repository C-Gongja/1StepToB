import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
	SharedValue,
	useAnimatedStyle,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface SwipeActionConfig {
	icon: string;
	color: string;
	backgroundColor?: string;
	onPress: () => void;
	hapticFeedback?: boolean;
}

interface SwipeableCardProps {
	children: React.ReactNode;
	leftActions?: SwipeActionConfig[];
	rightActions?: SwipeActionConfig[];
	disabled?: boolean;
	style?: any;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
	children,
	leftActions = [],
	rightActions = [],
	disabled = false,
	style,
}) => {
	const triggerHapticFeedback = () => {
		try {
			if (Platform.OS === 'ios') {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			}
		} catch (error) {
			console.warn('Haptic feedback not available:', error);
		}
	};

	const handleActionPress = (action: SwipeActionConfig) => {
		if (action.hapticFeedback !== false) {
			triggerHapticFeedback();
		}
		action.onPress();
	};

	const renderLeftActions = (prog: SharedValue<number>, drag: SharedValue<number>) => {
		if (leftActions.length === 0) return null;

		const styleAnimation = useAnimatedStyle(() => {
			return {
				transform: [{ translateX: Math.min(drag.value, -5) }]
			};
		});

		return (
			<Reanimated.View style={[styles.leftActionsContainer, styleAnimation]}>
				{leftActions.map((action, index) => (
					<TouchableOpacity
						key={index}
						style={[
							styles.actionButton,
							{ backgroundColor: action.backgroundColor || action.color }
						]}
						onPress={() => handleActionPress(action)}
						activeOpacity={0.7}
					>
						<Text style={[styles.actionText, { color: action.color }]}>
							{action.icon}
						</Text>
					</TouchableOpacity>
				))}
			</Reanimated.View>
		);
	};

	const renderRightActions = (prog: SharedValue<number>, drag: SharedValue<number>) => {
		if (rightActions.length === 0) return null;

		const styleAnimation = useAnimatedStyle(() => {
			return {
				transform: [{ translateX: Math.max(drag.value, 0) }],
			};
		});

		return (
			<Reanimated.View style={[styles.rightActionsContainer, styleAnimation]}>
				{rightActions.map((action, index) => (
					<TouchableOpacity
						key={index}
						style={[
							styles.actionButton,
							{ backgroundColor: action.backgroundColor || action.color }
						]}
						onPress={() => handleActionPress(action)}
						activeOpacity={0.7}
					>
						<Text style={[styles.actionText, { color: action.color }]}>
							{action.icon}
						</Text>
					</TouchableOpacity>
				))}
			</Reanimated.View>
		);
	};

	if (disabled) {
		return <View style={style}>{children}</View>;
	}

	return (
		<GestureHandlerRootView style={style}>
			<ReanimatedSwipeable
				renderLeftActions={leftActions.length > 0 ? renderLeftActions : undefined}
				renderRightActions={rightActions.length > 0 ? renderRightActions : undefined}
				leftThreshold={80}
				rightThreshold={80}
				overshootLeft={false}
				overshootRight={false}
			>
				<View style={styles.cardContent}>
					{children}
				</View>
			</ReanimatedSwipeable>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	cardContent: {
		backgroundColor: '#fff',
	},
	leftActionsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: '100%',
		width: 100,
	},
	rightActionsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: '100%',
		width: 100,
	},
	actionButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 100,
		height: '100%',
		// marginHorizontal: 4,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	actionText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000'
	},
});

export default SwipeableCard;