import React, { useState } from 'react';
import { caculateListWithArea } from './useTableSelector';
import TimeSelector from './TimeSelector';
import Footer from './Footer';
import './time-piker.scss'

export default function TimePicker () {
  const primeTime = {
    start: 18,
    end: 41
  }
  const [selectedList, setSelectedList] = useState([]);

  const handleChange = (selectedList) => {
    setSelectedList(selectedList)
  };

  // 清空数据
  const handleclear = () => {
    setSelectedList([])
  };

  // 选中工作日黄金时间
  const handlePrimeTimeForWorking = () => {
    const data = caculateListWithArea({
      start: {
        colIndex: primeTime.start,
        weekDayIndex: 0
      },
      end: {
        colIndex: primeTime.end,
        weekDayIndex: 4
      }
    })
    setSelectedList(data)
  }

  // 选中休息日黄金时间
  const handlePrimeTimeForWeekend = () => {
    const data = caculateListWithArea({
      start: {
        colIndex: primeTime.start,
        weekDayIndex: 5
      },
      end: {
        colIndex: primeTime.end,
        weekDayIndex: 6
      }
    })
    setSelectedList(data)
  }

  return (
    <div className="time-piker">
      <div className="time-piker-header">
        <div className="aria">
          <span className="selected"></span>
          已选
        </div>
        <div className="aria">
          <span></span>
          可选
        </div>
      </div>

      <TimeSelector onChange={handleChange} selectedList={selectedList} />

      <Footer
        selectedList={selectedList}
        onClear={handleclear}
        onPrimeTimeForWorking={handlePrimeTimeForWorking}
        onPrimeTimeForWeekend={handlePrimeTimeForWeekend}
      />
    </div>
  );
}
