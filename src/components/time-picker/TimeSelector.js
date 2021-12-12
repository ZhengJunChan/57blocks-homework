import React, { useState, useEffect } from 'react';
import { getTimes, inMovingArea } from './useTableSelector';

const HOURS_PER_DAY = 24; // 每日时长

export default function TimeSelector ({selectedList, onChange}) {
  const dataSource = getTimes()
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [mouseInfo, setMouseInfo] = useState([]);

  useEffect(() => {
    updateSelectedKeys()
  }, [selectedList]);

  // 时长表头
  const HourHeader = () => {
    const ths = []

    for (let colIndex = 0; colIndex < HOURS_PER_DAY; colIndex++) {
      ths.push(<th className="hour-column" colSpan="2" key={colIndex}>{colIndex}</th>)
    }

    return (<tr>{ ths }</tr>)
  }
  
  const updateSelectedKeys = () => {
    const keys = selectedList.map(({id}) => id);
    setSelectedKeys(keys)
  }
  
  const isSelected = (id) => {
    return selectedKeys.includes(id)
  }
  
  // 显示鼠标拖拽选中的区域
  const showMoveArea = (cell) => selecting && inMovingArea({ 
    downCell: mouseInfo.downCell,
    endMoveCell: mouseInfo.endMoveCell,
    cell
  })

  // 时间段被点击后，根据展示状态
  // 如果没选中，选中数据；否则取消选中
  const handleTimeClick = (current) => {
    const list = [...selectedList]
    const selected = isSelected(current.id)

    if (selected) {
      const indexInSelectedList = selectedList.findIndex(item => item.id === current.id)
      list.splice(indexInSelectedList, 1)
    } else {
      list.push(current)
    }

    onChange(list)
  }

  const handleMouseDown = (downCell) => {
    setMouseInfo({
      ...mouseInfo,
      downCell
    })
  }

  const handleMouseMove = (endMoveCell) => {
    const { downCell } = mouseInfo

    if (!downCell) {
      // 如果没有按下过鼠标，不操作
      return
    }

    setMouseInfo({
      ...mouseInfo,
      endMoveCell
    })

    // 更新selecting，用于鼠标移动时，页面计算可选区域样式
    setSelecting(true)
  }

  const handleMouseUP = (upCell) => {
    const { downCell } = mouseInfo

    const isClickEvent = downCell.weekDayIndex === upCell.weekDayIndex && downCell.colIndex === upCell.colIndex

    if (!isClickEvent) {
      // 如果不是点击事件，计算被选择的时间段
      setMouseInfo({
        ...mouseInfo,
        upCell
      })
      const list = []

      dataSource.forEach(({timeValues}) => {
        timeValues.forEach(cell => {
          if (isSelected(cell.id) || inMovingArea({ downCell, endMoveCell: upCell, cell })) {
            list.push(cell)
          }
        })
      })

      onChange(list)
    }

    setMouseInfo({})
    setSelecting(false)
  }
  
  return (
    <table className="time-selector" cellPadding="0" cellSpacing="0">
      <thead>
        <tr>
          <th rowSpan="2">星期/时间</th>
          <th colSpan="24">00:00-12:00</th>
          <th colSpan="24">12:00-24:00</th>
        </tr>
        <HourHeader />
      </thead>

      <tbody>
        {
          dataSource.map(item => (
            <tr key={item.weekDay}>
              <td>{item.weekDay}</td>
              {
                item.timeValues.map(time => (
                  <td
                    key={time.id}
                    title={`${time.startTimeText}-${time.endTimeText}`}
                    className={`${isSelected(time.id) ? 'selected' : ''} ${showMoveArea(time) ? 'moving' : ''}`}
                    onClick={() => handleTimeClick(time)}
                    onMouseDown={() => handleMouseDown(time)}
                    onMouseUp={() => handleMouseUP(time)}
                    onMouseMove={() => handleMouseMove(time)}
                  />
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
