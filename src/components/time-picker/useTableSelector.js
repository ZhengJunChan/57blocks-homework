
const FIRST_HALF_HOUR = 'firstHalfHour';
const HALF_HOUR_LATER = 'halfHourLater';
const POINT_MARK = ':00';
const HALF_MARK = ':30';
const HOURS_PER_DAY = 24; // 每日时长
const WEEK_DAYS = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

const timeMarkType = {
  [FIRST_HALF_HOUR]: POINT_MARK,
  [HALF_HOUR_LATER]: HALF_MARK
}

// 格式化时间格式：hh:mm
const formatTimeText = (markHour, markType) => {
  let hour = markHour
  
  if (markHour < 10) {
    hour = `0${hour}`
  }

  return `${hour}${timeMarkType[markType]}`
}

// 获取单元格数据，用于初始化时间表格
export const getTimes = () => {
  const data = []
  
  WEEK_DAYS.forEach((weekDay, weekDayIndex) => {
    const timeValues = []
    
    for (let colIndex = 0; colIndex < HOURS_PER_DAY; colIndex++) {
      const baseColIndex = 2 * colIndex
      timeValues.push({
        id: `${weekDay}${baseColIndex}`,
        weekDay,
        weekDayIndex,
        colIndex: baseColIndex,
        halfHour: FIRST_HALF_HOUR,
        selected: false,
        startTimeText: formatTimeText(colIndex, FIRST_HALF_HOUR),
        endTimeText: formatTimeText(colIndex, HALF_HOUR_LATER)
      })
      timeValues.push({
        id: `${weekDay}${baseColIndex + 1}`,
        weekDay,
        weekDayIndex,
        colIndex: baseColIndex + 1,
        halfHour: HALF_HOUR_LATER,
        selected: false,
        startTimeText: formatTimeText(colIndex, HALF_HOUR_LATER),
        endTimeText: formatTimeText((colIndex + 1), FIRST_HALF_HOUR)
      })
    }

    data.push({
      weekDay,
      timeValues
    })
  })

  return data
}

const dataSource = getTimes()

// 计算移动区域
const caculateMoveArea = ({start, end}) => {
  const newStart = {...start}
  const newEnd = {...end}
  if (start.weekDayIndex > end.weekDayIndex) {
    newStart.weekDayIndex = end.weekDayIndex
    newEnd.weekDayIndex = start.weekDayIndex
  }
  
  if (start.colIndex > end.colIndex) {
    newStart.colIndex = end.colIndex
    newEnd.colIndex = start.colIndex
  }

  return {
    start: newStart,
    end: newEnd
  }
}

// 根据选择区域计算选中的数据数组
export const caculateListWithArea = ({start, end}) => {
  const data = []

  dataSource.forEach(row => {
    row.timeValues.forEach(cell => {
      const inArea = inMovingArea({
        downCell: start,
        endMoveCell: end,
        cell
      })
      
      if (inArea) {
        data.push(cell)
      }
    })
  })
  
  return data
}

// 是否在选择区域中
export const inMovingArea = ({downCell, endMoveCell, cell}) => {
  const {start, end} = caculateMoveArea({
    start: downCell,
    end: endMoveCell
  })

  return start.weekDayIndex <= cell.weekDayIndex && cell.weekDayIndex <= end.weekDayIndex&& 
  start.colIndex <= cell.colIndex && cell.colIndex <= end.colIndex
}
