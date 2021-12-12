import React from 'react';

export default function Footer ({selectedList, onClear, onPrimeTimeForWorking, onPrimeTimeForWeekend}) {
  const hasSelectedTime = selectedList.length > 0

  // 格式化数据为可读时间段
  const formatTimes = (list) => {
    const result = []
    let timeText = ''
    list.forEach((current, index) => {
      const isFirst = timeText === ''
      
      if (isFirst) {
        timeText = current.startTimeText
      }
      
      const next = list[index + 1]
      const inOneRow = current.weekDay === next?.weekDay
      
      if (inOneRow) {
        if (current.colIndex + 1 !== next.colIndex) {
          timeText += `-${current.endTimeText}、${next.startTimeText}`
        }

        return
      }

      timeText  += `-${current.endTimeText}`

      result.push({
        name: current.weekDay,
        timeText
      })

      timeText = ''
    });
  
    return result
  }
  
  // 数据内容
  const SelectList = () => {
    const list = formatTimes(selectedList);
    
    return (
      <div>
        <div>已选时间段</div>
        <div>
          {
            list.map(row => (
              <div className="selected-text-row" key={row.name}>
                <div className="selected-text-row-name">{row.name}</div>
                <div className="selected-text-row-text">{row.timeText}</div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  // 空数据提示
  const EmptyTip = () => (<div>可拖动鼠标选择时间段</div>)

  return (
    <div className="time-piker-footer">
      <div className="button-group">
       { hasSelectedTime ? <span className="button clear-button" onClick={onClear}>清空</span> : null }
        {/* <span className="button clear-button" onClick={onClear}>清空</span> */}
        <span className="button" onClick={onPrimeTimeForWorking}>工作日黄金时间</span>
        <span className="button" onClick={onPrimeTimeForWeekend}>休息日黄金时间</span>
      </div>
      { hasSelectedTime ? <SelectList /> : <EmptyTip /> }
    </div>
  );
}
