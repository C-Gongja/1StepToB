import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { ScheduledItem, ScheduleFormData } from "../types/Todo";
import { useScheduleStore } from "../stores/scheduleStore";
import { isToday, isTomorrow, isOverdue } from "../utils/dateUtils";
import ScheduleItem from "../components/schedule/ScheduleItem";
import ScheduleForm from "../components/schedule/ScheduleForm";
import TodoItem from "../components/todo/TodoItem";
import TodoForm from "../components/todo/TodoForm";
import { SwipeableCard } from "../components/common";
import { useTodoActions } from "../hooks/useTodoActions";

interface HomeScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
  };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    todos,
    showForm,
    editingTodo,
    handleEdit,
    handleDelete,
    handleToggleComplete,
    handleFormSubmit,
    handleFormClose,
  } = useTodoActions();
  const { items: scheduledItems, updateItem, deleteItem } = useScheduleStore();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState<
    ScheduledItem | undefined
  >();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const { todaysTodos, upcomingTodos, overdueTodos, todaysSchedule, stats } =
    useMemo(() => {
      const now = new Date();
      const todaysTodos = todos
        .filter(
          (todo) =>
            !todo.completed && (todo.dueDate ? isToday(todo.dueDate) : false)
        )
        .slice(0, 3);

      const upcomingTodos = todos
        .filter(
          (todo) =>
            !todo.completed &&
            todo.dueDate &&
            (isTomorrow(todo.dueDate) || todo.dueDate > now)
        )
        .slice(0, 3);

      const overdueTodos = todos
        .filter(
          (todo) => !todo.completed && todo.dueDate && isOverdue(todo.dueDate)
        )
        .slice(0, 3);

      const todaysSchedule = scheduledItems
        .filter((item) => {
          if (!item.startTime) return false;
          const itemDate = new Date(item.startTime);
          return !isNaN(itemDate.getTime()) && isToday(itemDate);
        })
        .sort((a, b) => {
          const dateA = new Date(a.startTime);
          const dateB = new Date(b.startTime);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 3);

      const completedTodosCount = todos.filter((todo) => todo.completed).length;
      const pendingTodosCount = todos.length - completedTodosCount;

      return {
        todaysTodos,
        upcomingTodos,
        overdueTodos,
        todaysSchedule,
        stats: {
          pendingTodosCount,
          completedTodosCount,
          todaysScheduleCount: todaysSchedule.length,
        },
      };
    }, [todos, scheduledItems]);

  const handleEditSchedule = useCallback((item: ScheduledItem) => {
    setEditingScheduleItem(item);
    setShowScheduleForm(true);
  }, []);

  const handleDeleteSchedule = useCallback(
    (id: string) => {
      deleteItem(id);
    },
    [deleteItem]
  );

  const handleScheduleFormSubmit = useCallback(
    (data: ScheduleFormData) => {
      if (editingScheduleItem) {
        updateItem(editingScheduleItem.id, {
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          isAllDay: data.isAllDay,
          category: data.category,
          color: data.color,
        });
      }
      setShowScheduleForm(false);
      setEditingScheduleItem(undefined);
    },
    [editingScheduleItem, updateItem]
  );

  const handleScheduleFormClose = useCallback(() => {
    setShowScheduleForm(false);
    setEditingScheduleItem(undefined);
  }, []);

  const QuickStatsCard = ({
    title,
    value,
    subtitle,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
  }) => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={[styles.statsValue, { color }]}>{value}</Text>
      <Text style={styles.statsSubtitle}>{subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.quoteContainer}>
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.subtitle}>Here's what's happening today</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <QuickStatsCard
            title="Pending"
            value={stats.pendingTodosCount}
            subtitle="todos left"
            color="#FF9500"
          />
          <QuickStatsCard
            title="Completed"
            value={stats.completedTodosCount}
            subtitle="todos done"
            color="#34C759"
          />
          <QuickStatsCard
            title="Today"
            value={stats.todaysScheduleCount}
            subtitle="events"
            color="#007AFF"
          />
        </View>

        {/* Overdue Todos */}
        {overdueTodos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: "#FF3B30" }]}>
                ⚠️ Overdue
              </Text>
              <TouchableOpacity onPress={() => navigation?.navigate("Todos")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {overdueTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onPress={() => handleEdit(todo)}
              />
            ))}
          </View>
        )}

        {/* Today's Todos */}
        {todaysTodos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📝 Today's Todos</Text>
              <TouchableOpacity onPress={() => navigation?.navigate("Todos")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {todaysTodos.map((todo) => (
              <SwipeableCard
                key={todo.id}
                rightActions={[
                  {
                    icon: "Delete",
                    color: "#fff",
                    backgroundColor: "#FF3B30",
                    onPress: () => handleDelete(todo.id),
                  },
                ]}
              >
                <TodoItem
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onPress={() => handleEdit(todo)}
                />
              </SwipeableCard>
            ))}
          </View>
        )}

        {/* Today's Schedule */}
        {todaysSchedule.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📅 Today's Schedule</Text>
              {/* schedule의 day로 navigate */}
              <TouchableOpacity
                onPress={() => navigation?.navigate("Schedule")}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {todaysSchedule.map((item) => (
              <ScheduleItem
                key={item.id}
                item={item}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
              />
            ))}
          </View>
        )}

        {/* Upcoming Todos */}
        {upcomingTodos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📋 Upcoming</Text>
              <TouchableOpacity onPress={() => navigation?.navigate("Todos")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {upcomingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onPress={() => handleEdit(todo)}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {todos.length === 0 && scheduledItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Welcome to StepToB!</Text>
            <Text style={styles.emptyStateText}>
              Start by adding your first todo or scheduling an event
            </Text>
            <View style={styles.emptyStateButtons}>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation?.navigate("Todos")}
              >
                <Text style={styles.emptyButtonText}>Add Todo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.emptyButton, styles.emptyButtonSecondary]}
                onPress={() => navigation?.navigate("Schedule")}
              >
                <Text
                  style={[
                    styles.emptyButtonText,
                    styles.emptyButtonTextSecondary,
                  ]}
                >
                  Schedule Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <ScheduleForm
        visible={showScheduleForm}
        onClose={handleScheduleFormClose}
        onSubmit={handleScheduleFormSubmit}
        editingItem={editingScheduleItem}
      />

      <TodoForm
        visible={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingTodo={editingTodo}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  header: {
    minHeight: 500,
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  quoteContainer: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    height: "90%",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statsSubtitle: {
    fontSize: 12,
    color: "#999",
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    backgroundColor: "#fff",
    // paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButtons: {
    flexDirection: "row",
    gap: 12,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  emptyButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyButtonTextSecondary: {
    color: "#007AFF",
  },
});
