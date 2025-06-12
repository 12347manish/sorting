const App = () => {
    const [array, setArray] = React.useState([]);
    const [isSorting, setIsSorting] = React.useState(false);
    const [forceStop, setForceStop] = React.useState(false); // New state for stopping
    const [arraySize, setArraySize] = React.useState(30);
    const [sortSpeed, setSortSpeed] = React.useState(50);
    const [selectedAlgorithm, setSelectedAlgorithm] = React.useState('bubbleSort');
    const arrayContainerRef = React.useRef(null);

    // Function to reset bar colors to default (dodgerblue or the one from CSS)
    const resetBarColors = () => {
        if (arrayContainerRef.current) {
            const bars = arrayContainerRef.current.children;
            for (let bar of bars) {
                bar.style.backgroundColor = '#3498db'; // Match updated CSS default bar color
            }
        }
    };

    const generateRandomArray = React.useCallback(() => {
        if (isSorting) return;
        setForceStop(false); // Reset stop flag on new array
        const newArray = [];
        // ... (rest of generateRandomArray logic remains the same)
        const containerWidth = arrayContainerRef.current ? arrayContainerRef.current.offsetWidth : 500;
        const barMargin = 2 * 2; 
        const availableWidth = containerWidth - (arraySize * barMargin);
        const barWidth = arraySize > 0 ? Math.max(1, Math.floor(availableWidth / arraySize)) : 1;
        for (let i = 0; i < arraySize; i++) {
            newArray.push(Math.floor(Math.random() * 280) + 20);
        }
        setArray(newArray);
        resetBarColors(); // Use the new helper
    }, [arraySize, isSorting]);

    React.useEffect(() => {
        generateRandomArray();
    }, [arraySize, generateRandomArray]);

    const handleStopSort = () => {
        setForceStop(true); 
        // Note: The actual stopping logic is within the sorting algorithms.
        // setIsSorting(false) will be handled by the onSortFinishCallback when the algorithm acknowledges the stop.
    };

    const onSortCompletion = () => {
        setIsSorting(false);
        setForceStop(false); // Reset stop flag when sort finishes or is stopped
        // Optionally, color all green if not stopped early, or reset if stopped.
        // For now, algorithms handle final green coloring if completed.
        // If stopped, colors should ideally be reset by the algorithm before it exits.
    };

    const handleSort = async () => {
        if (isSorting) return;
        setIsSorting(true);
        setForceStop(false); // Reset stop flag before starting a new sort
        
        resetBarColors(); // Reset colors before sort starts

        const checkStopSignal = () => forceStop; // Pass this function to sort algos

        // Simplified callback
        const commonCallback = () => onSortCompletion();

        if (selectedAlgorithm === 'bubbleSort') {
            await window.bubbleSortForReact(array, setArray, commonCallback, arrayContainerRef, sortSpeed, checkStopSignal);
        } else if (selectedAlgorithm === 'mergeSort') {
            await window.mergeSortForReact(array, setArray, commonCallback, arrayContainerRef, sortSpeed, checkStopSignal);
        } else if (selectedAlgorithm === 'quickSort') {
            await window.quickSortForReact(array, setArray, commonCallback, arrayContainerRef, sortSpeed, checkStopSignal);
        } else if (selectedAlgorithm === 'selectionSort') { 
            await window.selectionSortForReact(array, setArray, commonCallback, arrayContainerRef, sortSpeed, checkStopSignal);
        } else if (selectedAlgorithm === 'heapSort') { 
            await window.heapSortForReact(array, setArray, commonCallback, arrayContainerRef, sortSpeed, checkStopSignal);
        }
    };
    
    // ... (handleSizeChange, handleSpeedChange, handleAlgorithmChange remain the same)
    const handleSizeChange = (event) => {
        if (isSorting) return;
        setArraySize(parseInt(event.target.value));
    };

    const handleSpeedChange = (event) => {
        if (isSorting) return;
        const sliderValue = parseInt(event.target.value); 
        const minDelay = 200; 
        const maxDelay = 5;   
        const speed = Math.round(minDelay - ((sliderValue - 1) / (100 - 1)) * (minDelay - maxDelay));
        setSortSpeed(speed);
    };

    const handleAlgorithmChange = (event) => {
        if (isSorting) return;
        setSelectedAlgorithm(event.target.value);
    };
    
    const containerWidth = arrayContainerRef.current ? arrayContainerRef.current.offsetWidth : 500;
    const barMargin = 2 * 2;
    const calculatedBarWidth = arraySize > 0 ? Math.max(1, Math.floor((containerWidth - (arraySize * barMargin)) / arraySize)) : 1;

    return (
        <div className="container">
            <div className="controls">
                <button onClick={generateRandomArray} disabled={isSorting} style={{ flexBasis: '100%', marginBottom: '10px' }}>Generate New Array</button>
                
                <div style={{ flexBasis: 'calc(50% - 10px)', marginBottom: '10px' }}> {/* Adjusted for spacing */}
                    <label htmlFor="algorithm">Algorithm:</label>
                    <select id="algorithm" value={selectedAlgorithm} onChange={handleAlgorithmChange} disabled={isSorting}>
                        <option value="bubbleSort">Bubble Sort</option>
                        <option value="mergeSort">Merge Sort</option>
                        <option value="quickSort">Quick Sort</option>
                        <option value="selectionSort">Selection Sort</option>
                        <option value="heapSort">Heap Sort</option>
                    </select>
                </div>

                {/* Main Sort/Stop buttons container */}
                <div style={{ flexBasis: 'calc(50% - 10px)', marginBottom: '10px', display: 'flex' }}>
                    {!isSorting ? (
                        <button onClick={handleSort} disabled={isSorting} style={{flexGrow: 1}}>Sort</button>
                    ) : (
                        <button onClick={handleStopSort} style={{backgroundColor: '#dc3545', flexGrow: 1}}>Stop</button> /* Red Stop button */
                    )}
                </div>
                
                <div style={{ flexBasis: 'calc(50% - 10px)', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <label htmlFor="arraySize">Size:</label>
                    <input 
                        type="range" id="arraySize" min="5" max="150" 
                        value={arraySize} onChange={handleSizeChange} disabled={isSorting} 
                    />
                    <span>{arraySize}</span>
                </div>

                <div style={{ flexBasis: 'calc(50% - 10px)', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <label htmlFor="sortSpeed">Speed:</label>
                    <input 
                        type="range" id="sortSpeed" min="1" max="100" 
                        defaultValue="50" onChange={handleSpeedChange} disabled={isSorting}
                    />
                </div>
            </div>
            <div className="array-container" ref={arrayContainerRef} style={{ minHeight: '350px' }}>
                {array.map((value, idx) => (
                    <div
                        className="array-bar"
                        key={idx}
                        style={{
                            height: `${value}px`,
                            width: `${calculatedBarWidth}px`,
                            backgroundColor: '#3498db' // Default bar color from new CSS
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
