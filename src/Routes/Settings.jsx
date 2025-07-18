import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStock, removeStock } from '../store/stockSlice';
import { setLifeGoals } from '../store/goalSlice';
import stockDatabase from '../data/kr_stocks.json';

function Settings() {
  const [activePanel, setActivePanel] = useState("main");
  const [showModal, setShowModal] = useState(false);
  const [newStock, setNewStock] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [warning, setWarning] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  // Local state for life goals input
  const [lifeGoalsInput, setLifeGoalsInput] = useState(["", "", ""]);

  const stocks = useSelector((state) => state.stocks.list);
  const dispatch = useDispatch();

  const goalsFromStore = useSelector(state => state.goals.lifeGoals);

  useEffect(() => {
    setLifeGoalsInput(goalsFromStore);
  }, []);

  const handleAddStock = () => {
    if (selectedStock) {
      if (stocks.length >= 5) {
        setWarning('최대 5개까지만 저장이 가능합니다');
        return;
      }
      if (stocks.find(stock => stock.name === selectedStock.name)) {
        setWarning('이미 추가된 종목입니다');
        return;
      }
      dispatch(addStock(selectedStock));
      setNewStock('');
      setSuggestions([]);
      setSelectedStock(null);
      setShowModal(false);
      setWarning('');
    } else {
      setWarning('항목을 선택해주세요');
    }
  };

return (
    <div className="min-h-screen w-full bg-ing-bg-dark font-sans overflow-auto">

        <div className={`absolute w-full h-screen bg-ing-bg-light top-0 left-0 transition-transform duration-300 ${activePanel === 'main' ? 'translate-x-0' : 'translate-x-full hidden'}`}>
            <button
                className="flex justify-between items-center w-[calc(100%-3rem)] mx-4 my-3 p-4 text-left border border-ing-border rounded-lg bg-ing-bg-light text-lg font-medium shadow hover:bg-ing-bg-light/90"
                onClick={() => {
                  setActivePanel("story");
                }}
            >
                <span className="settings-item-label">스토리 설정</span>
                <span className="arrow">→</span>
            </button>
        </div>

        <div
            className={`absolute w-full h-screen bg-ing-bg-light top-0 left-0 transition-transform duration-300 z-10 ${
                activePanel === 'story'
                    ? 'translate-x-0'
                    : 'translate-x-full hidden'
            }`}
        >
            <button className="px-4 py-3 text-left text-ing-primary font-semibold hover:underline" onClick={() => {
              setActivePanel("main");
            }}>
                ← 뒤로
            </button>
            <button className="flex justify-between items-center w-[calc(100%-3rem)] mx-4 my-3 p-4 text-left border border-ing-border rounded-lg bg-ing-bg-light text-lg font-medium shadow hover:bg-ing-bg-light/90" onClick={() => setActivePanel("stock")}>
                <span className="settings-item-label">주식 설정</span>
                <span className="arrow">→</span>
            </button>
            <button className="flex justify-between items-center w-[calc(100%-3rem)] mx-4 my-3 p-4 text-left border border-ing-border rounded-lg bg-ing-bg-light text-lg font-medium shadow hover:bg-ing-bg-light/90" onClick={() => setActivePanel("quote")}>
                <span className="settings-item-label">명언 설정</span>
                <span className="arrow">→</span>
            </button>
            <button className="flex justify-between items-center w-[calc(100%-3rem)] mx-4 my-3 p-4 text-left border border-ing-border rounded-lg bg-ing-bg-light text-lg font-medium shadow hover:bg-ing-bg-light/90" onClick={() => setActivePanel("weather")}>
                <span className="settings-item-label">날씨 설정</span>
                <span className="arrow">→</span>
            </button>
            <button className="flex justify-between items-center w-[calc(100%-3rem)] mx-4 my-3 p-4 text-left border border-ing-border rounded-lg bg-ing-bg-light text-lg font-medium shadow hover:bg-ing-bg-light/90" onClick={() => setActivePanel("news")}>
                <span className="settings-item-label">뉴스 설정</span>
                <span className="arrow">→</span>
            </button>
        </div>

        <div
            className={`absolute w-full h-screen bg-ing-bg-light top-0 left-0 transition-transform duration-300 z-10 ${
                activePanel === 'stock' ? 'translate-x-0' : 'translate-x-full hidden'
            }`}
        >
            <button className="px-4 py-3 text-left text-ing-primary font-semibold hover:underline" onClick={() => setActivePanel("story")}>
                ← 뒤로
            </button>
            <h2 className="text-center text-xl font-semibold mt-4">주식 설정</h2>

            <table
                className="w-[90%] mx-auto mt-4 border-collapse"
            >
                <thead>
                    <tr>
                        <th className="border-b border-ing-border p-2 text-center">No.</th>
                        <th className="border-b border-ing-border p-2 text-center w-[70%]">Stock</th>
                        <th className="border-b border-ing-border p-2 text-center w-[20%]">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => (
                        <tr key={index}>
                            <td className="border-b border-ing-border p-2 text-center">
                                {index + 1}
                            </td>
                            <td className="border-b border-ing-border p-2 text-center w-[70%]">
                                {stock.name}
                            </td>
                            <td className="border-b border-ing-border p-2 text-center w-[20%]">
                              <button
                                onClick={() => dispatch(removeStock(index))}
                                className="bg-danger text-white px-3 py-1 rounded hover:bg-danger/90 text-sm"
                              >
                                x
                              </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="centered">
                <button
                    onClick={() => {
                      setNewStock('');
                      setSuggestions([]);
                      setSelectedStock(null);
                      setWarning('');
                      setShowModal(true);
                    }}
                    className="add-button flex justify-center mx-auto mt-4 px-6 py-2 bg-ing-primary text-white rounded hover:bg-ing-primary/90"
                >
                    Add
                </button>
            </div>
        </div>


    {/* Modal for adding stock */}
    {showModal && (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-ing-bg-light p-6 rounded-lg w-[90%] max-w-md shadow-lg">
          <h3 className="mt-0 text-lg font-semibold">Add Stock</h3>
          {warning && <p className="text-danger my-2">{warning}</p>}
          <input
            type="text"
            value={newStock}
            onChange={(e) => {
              const value = e.target.value;
              setNewStock(value);
              const searchValue = value.replace(/\s/g, '');
              setSuggestions(
                stockDatabase.filter(stock =>
                  stock.name.replace(/\s/g, '').includes(searchValue)
                ).slice(0, 5)
              );
            }}
            placeholder="Enter stock name"
            className="w-full p-3 mb-3 text-base border border-ing-border rounded"
          />
          <ul className="list-none p-0 mb-3">
            {suggestions.map((stock, index) => (
              <li
                key={index}
                onClick={() => setSelectedStock(stock)}
                className={`p-2 border rounded mb-1 cursor-pointer hover:bg-ing-primary/20 ${
                  selectedStock?.name === stock.name ? 'border-2 border-ing-primary font-bold' : ''
                }`}
              >
                {stock.name} ({stock.code})
              </li>
            ))}
          </ul>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-border-muted rounded hover:bg-border">Cancel</button>
            <button onClick={handleAddStock} className="px-4 py-2 bg-ing-primary text-white rounded hover:bg-ing-primary/90">Add</button>
          </div>
        </div>
      </div>
    )}


    <div className={`absolute w-full h-screen bg-ing-bg-light top-0 left-0 transition-transform duration-300 z-10 ${activePanel === 'quote' ? 'translate-x-0' : 'translate-x-full hidden'}`}>
        <button className="px-4 py-3 text-left text-ing-primary font-semibold hover:underline" onClick={() => setActivePanel("story")}>← 뒤로</button>
        <h2 className="text-center text-xl font-semibold mt-4">명언 설정</h2>
        <div className="mt-6 mx-4 p-4 bg-ing-bg rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">인생 목표 설정</h3>
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="w-6 mr-2">{index + 1}.</span>
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-ing-border rounded"
                placeholder={goalsFromStore[index] || `목표 ${index + 1}`}
                value={lifeGoalsInput[index]}
                onChange={e => {
                  const newGoals = [...lifeGoalsInput];
                  newGoals[index] = e.target.value;
                  setLifeGoalsInput(newGoals);
                }}
              />
            </div>
          ))}
          <button
            onClick={() => dispatch(setLifeGoals(lifeGoalsInput))}
            className="mt-4 px-4 py-2 bg-ing-primary text-white rounded hover:bg-ing-primary/90"
          >
            Save Life Goals
          </button>
        </div>
    </div>


    <div className={`absolute w-full h-screen bg-ing-bg-light top-0 left-0 transition-transform duration-300 z-10 ${activePanel === 'weather' ? 'translate-x-0' : 'translate-x-full hidden'}`}>
        <button className="px-4 py-3 text-left text-ing-primary font-semibold hover:underline" onClick={() => setActivePanel("story")}>← 뒤로</button>
        <h2 className="text-center text-xl font-semibold mt-4">날씨 설정</h2>
    </div>


    <div className={`absolute w-full h-screen bg-ing-bg-light top-0 left-0 transition-transform duration-300 z-10 ${activePanel === 'news' ? 'translate-x-0' : 'translate-x-full hidden'}`}>
        <button className="px-4 py-3 text-left text-ing-primary font-semibold hover:underline" onClick={() => setActivePanel("story")}>← 뒤로</button>
        <h2 className="text-center text-xl font-semibold mt-4">뉴스 설정</h2>
    </div>
    </div>
);
}

export default Settings;