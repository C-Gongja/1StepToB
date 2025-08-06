import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

interface GrassData {
  date: string;
  count: number;
}

type ViewType = "connect" | "non-connect";

interface GrassTrackerProps {
  data?: GrassData[];
  title?: string;
  viewType?: ViewType;
  onViewTypeChange?: (viewType: ViewType) => void;
  userJoinDate: string; // 유저 가입일 (YYYY-MM-DD 형식)
}

const GrassTracker: React.FC<GrassTrackerProps> = ({
  data = [],
  title = "Activity",
  userJoinDate,
}) => {
  const [viewType, setViewType] = React.useState<ViewType>("connect");
  // 활동 강도에 따른 색상 반환
  const getColorForCount = (count: number): string => {
    if (count === 0) return "#ebedf0";
    if (count <= 2) return "#9be9a8";
    if (count <= 4) return "#40c463";
    if (count <= 6) return "#30a14e";
    return "#216e39";
  };

  // 데이터를 맵으로 변환 (빠른 조회)
  const dataMap = data.reduce((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {} as Record<string, number>);

  // 가입일부터 오늘까지의 날짜 생성
  const generateUserDates = () => {
    const dates = [];
    const joinDate = new Date(userJoinDate);
    const today = dayjs();

    const currentDate = dayjs(userJoinDate).toDate();

    while (currentDate <= today) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Connect 뷰: GitHub 스타일 연속 흐름
  const renderConnectView = () => {
    const dates = generateUserDates();
    const joinDate = dayjs(userJoinDate).toDate();

    const startDayOfWeek = joinDate.getDay();
    const paddedDates = [
      ...Array(startDayOfWeek).fill(null), // 빈 셀로 패딩
      ...dates,
    ];

    // 7일씩 그룹화하여 주 단위로 나누기
    const weeks = [];
    for (let i = 0; i < paddedDates.length; i += 7) {
      weeks.push(paddedDates.slice(i, i + 7));
    }

    // 월 라벨 생성 - 각 월이 시작하는 주 위치 찾기
    const getMonthLabels = () => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const labels = [];
      let currentMonth = joinDate.getMonth();
      console.log("currentMonth: ", currentMonth);
      let currentYear = joinDate.getFullYear();
      console.log("currentYear: ", currentYear);

      weeks.forEach((week, weekIndex) => {
        const firstValidDate = week.find((date) => date !== null);
        if (firstValidDate) {
          const date = dayjs(firstValidDate).toDate();
          const monthIndex = date.getMonth();
          const year = date.getFullYear();

          // 새로운 월이 시작되는 경우
          if (monthIndex !== currentMonth || year !== currentYear) {
            labels.push({
              weekIndex,
              month: months[monthIndex],
            });
            currentMonth = monthIndex;
            currentYear = year;
          }
        }
      });

      // 첫 번째 월 추가
      if (labels.length === 0 || labels[0].weekIndex > 0) {
        labels.unshift({
          weekIndex: 0,
          month: months[joinDate.getMonth()],
        });
      }

      return labels;
    };

    const monthLabels = getMonthLabels();
    console.log("monthLabels: ", monthLabels);
    return (
      <>
        {/* 월 라벨 */}
        <View style={styles.connectMonthLabels}>
          {monthLabels.map((label, index) => (
            <Text
              key={index}
              style={[
                styles.connectMonthLabel,
                { left: label.weekIndex * 12 + 30 }, // 요일 라벨 공간 + 주 간격
              ]}
            >
              {label.month}
            </Text>
          ))}
        </View>

        <View style={styles.connectContainer}>
          {/* 요일 라벨 */}
          <View style={styles.connectDayLabels}>
            <Text style={styles.connectDayLabel}>Sun</Text>
            <Text style={styles.connectDayLabel}>Mon</Text>
            <Text style={styles.connectDayLabel}>Tue</Text>
            <Text style={styles.connectDayLabel}>Wed</Text>
            <Text style={styles.connectDayLabel}>Thu</Text>
            <Text style={styles.connectDayLabel}>Fri</Text>
            <Text style={styles.connectDayLabel}>Sat</Text>
          </View>

          {/* Grass 그리드 */}
          <View style={styles.connectGrid}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.connectWeek}>
                {week.map((date, dayIndex) => {
                  const count = date ? dataMap[date] || 0 : 0;
                  const color = date ? getColorForCount(count) : "transparent";

                  return (
                    <View
                      key={dayIndex}
                      style={[
                        styles.connectDay,
                        {
                          backgroundColor: color,
                          opacity: date ? 1 : 0,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </>
    );
  };

  // Non-Connect 뷰: 월별 블록으로 분리하되 요일 연속성 유지
  const renderNonConnectView = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const joinDay = dayjs(userJoinDate);
    const today = dayjs();

    // 월별 블록 데이터 생성
    const getMonthlyBlocks = () => {
      const blocks = [];
      let current = joinDay.startOf("month");
      let runningWeekday = joinDay.day(); // 연속된 요일 추적

      while (current.isBefore(today) || current.isSame(today, "month")) {
        const year = current.year();
        const month = current.month();
        const monthName = months[month];

        const firstDayOfMonth = current.startOf("month");
        const lastDayOfMonth = current.endOf("month");

        let startDate = firstDayOfMonth;
        let endDate = lastDayOfMonth;

        if (current.isSame(joinDay, "month")) {
          startDate = joinDay;
          runningWeekday = joinDay.day(); // 가입일의 요일부터 시작
        }

        if (current.isSame(today, "month")) {
          endDate = today;
        }

        // 7xN 그리드 (일~토)
        const grid: (string | null)[][] = Array(7)
          .fill(null)
          .map(() => []);

        let currentWeekday = runningWeekday;
        let currentDay = startDate;
        let isFirstWeek = true;

        while (currentDay.isSameOrBefore(endDate)) {
          // 첫 주의 패딩 처리
          if (isFirstWeek) {
            for (let d = 0; d < currentWeekday; d++) {
              grid[d].push(null);
            }
          } else {
            currentWeekday = 0; // 이후 주는 항상 일요일부터
          }

          // 주 채우기
          for (
            let d = currentWeekday;
            d < 7 && currentDay.isSameOrBefore(endDate);
            d++
          ) {
            const dateStr = currentDay.format("YYYY-MM-DD");
            grid[d].push(dateStr);
            currentDay = currentDay.add(1, "day");
          }

          isFirstWeek = false;
        }

        // 다음 월 시작 요일 갱신
        runningWeekday = currentDay.day();

        // 최대 열 수
        const maxColumns = Math.max(...grid.map((row) => row.length));

        blocks.push({
          monthName,
          grid,
          maxColumns,
        });

        current = current.add(1, "month");
      }

      return blocks;
    };

    const monthlyBlocks = getMonthlyBlocks();
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <>
        {/* 월 라벨 */}
        <View style={styles.nonConnectHeader}>
          <View style={styles.nonConnectDayLabelSpace} />
          {monthlyBlocks.map((block, index) => (
            <View
              key={index}
              style={[
                styles.nonConnectMonthLabel,
                { width: block.maxColumns * 10 + (block.maxColumns - 1) * 2 },
              ]}
            >
              <Text style={styles.nonConnectMonthText}>{block.monthName}</Text>
            </View>
          ))}
        </View>

        {/* 메인 그리드 */}
        <View style={styles.nonConnectGrid}>
          {dayLabels.map((dayLabel, dayIndex) => (
            <View key={dayIndex} style={styles.nonConnectRow}>
              <View style={styles.nonConnectDayLabel}>
                <Text style={styles.nonConnectDayText}>{dayLabel}</Text>
              </View>

              {monthlyBlocks.map((block, monthIndex) => (
                <View key={monthIndex} style={styles.nonConnectMonthBlock}>
                  <View style={styles.nonConnectDayRow}>
                    {Array.from({ length: block.maxColumns }).map(
                      (_, colIndex) => {
                        const date = block.grid[dayIndex]?.[colIndex];

                        if (date) {
                          const count = dataMap[date] || 0;
                          const color = getColorForCount(count);
                          return (
                            <View
                              key={colIndex}
                              style={[
                                styles.nonConnectDay,
                                { backgroundColor: color },
                              ]}
                            />
                          );
                        } else {
                          return (
                            <View
                              key={colIndex}
                              style={[
                                styles.nonConnectDay,
                                { backgroundColor: "transparent" },
                              ]}
                            />
                          );
                        }
                      }
                    )}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* 제목과 뷰 전환 버튼 */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        {setViewType && (
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewType === "connect" && styles.toggleButtonActive,
              ]}
              onPress={() => setViewType("connect")}
            >
              <Text
                style={[
                  styles.toggleText,
                  viewType === "connect" && styles.toggleTextActive,
                ]}
              >
                Connect
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewType === "non-connect" && styles.toggleButtonActive,
              ]}
              onPress={() => setViewType("non-connect")}
            >
              <Text
                style={[
                  styles.toggleText,
                  viewType === "non-connect" && styles.toggleTextActive,
                ]}
              >
                Non-Connect
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 뷰 렌더링 */}
      {viewType === "connect" ? renderConnectView() : renderNonConnectView()}

      {/* 범례 */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendColors}>
          <View style={[styles.legendSquare, { backgroundColor: "#ebedf0" }]} />
          <View style={[styles.legendSquare, { backgroundColor: "#9be9a8" }]} />
          <View style={[styles.legendSquare, { backgroundColor: "#40c463" }]} />
          <View style={[styles.legendSquare, { backgroundColor: "#30a14e" }]} />
          <View style={[styles.legendSquare, { backgroundColor: "#216e39" }]} />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#24292e",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#f6f8fa",
    borderRadius: 6,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toggleButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 12,
    color: "#586069",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#24292e",
  },

  // Connect View Styles (GitHub 스타일 연속 흐름)
  connectMonthLabels: {
    position: "relative",
    height: 20,
    marginBottom: 4,
  },
  connectMonthLabel: {
    position: "absolute",
    fontSize: 10,
    color: "#586069",
    fontWeight: "600",
  },
  connectContainer: {
    flexDirection: "row",
  },
  connectDayLabels: {
    width: 30,
    justifyContent: "space-between",
    paddingRight: 4,
  },
  connectDayLabel: {
    fontSize: 9,
    color: "#586069",
    height: 10,
    textAlignVertical: "center",
    marginBottom: 2,
  },
  connectGrid: {
    flexDirection: "row",
    flex: 1,
  },
  connectWeek: {
    flexDirection: "column",
    marginRight: 2,
  },
  connectDay: {
    width: 10,
    height: 10,
    marginBottom: 2,
    borderRadius: 2,
  },

  // Non-Connect View Styles (월별 블록, 요일 연속성 유지)
  nonConnectHeader: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "center",
  },
  nonConnectDayLabelSpace: {
    width: 30,
  },
  nonConnectMonthLabel: {
    alignItems: "baseline",
    marginRight: 3,
  },
  nonConnectMonthText: {
    fontSize: 10,
    color: "#586069",
    fontWeight: "600",
  },
  nonConnectGrid: {
    flexDirection: "column",
  },
  nonConnectRow: {
    flexDirection: "row",
    marginBottom: 0,
    alignItems: "center",
  },
  nonConnectDayLabel: {
    width: 30,
    paddingRight: 4,
  },
  nonConnectDayText: {
    fontSize: 10,
    color: "#586069",
    textAlign: "right",
  },
  nonConnectMonthBlock: {
    marginRight: 5,
  },
  nonConnectDayRow: {
    flexDirection: "row",
  },
  nonConnectDay: {
    width: 10,
    height: 10,
    marginBottom: 2,
    marginRight: 2,
    borderRadius: 2,
  },

  // Legend Styles
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  legendText: {
    fontSize: 10,
    color: "#586069",
    marginHorizontal: 4,
  },
  legendColors: {
    flexDirection: "row",
  },
  legendSquare: {
    width: 10,
    height: 10,
    marginHorizontal: 1,
    borderRadius: 2,
  },
});

export default GrassTracker;
