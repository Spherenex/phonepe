import React, { useState, useEffect, useRef } from 'react';
import './PhonePe.css';
import { Camera, User, QrCode, Bell, Home, Store, Shield, DollarSign, History, Info, X, Send, Smartphone, CreditCard, Lightbulb, CheckCircle, ChevronRight, Volume2, VolumeX } from 'lucide-react';

const PhonePeReplica = () => {
  // State Management - Define all state variables at the beginning
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState('face');
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [pin, setPin] = useState('');
  const [gesturePath, setGesturePath] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceScanProgress, setFaceScanProgress] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState({});
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedBillType, setSelectedBillType] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [billDetails, setBillDetails] = useState(null);
  const [balance, setBalance] = useState(5000);
  const [transactions, setTransactions] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Voice Feedback States
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    try {
      return localStorage.getItem('voiceEnabled') === 'true';
    } catch (e) {
      return false;
    }
  });
  
  const [voiceSettings, setVoiceSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('voiceSettings');
      return saved ? JSON.parse(saved) : { language: 'en-US', pitch: 1, rate: 1 };
    } catch (e) {
      return { language: 'en-US', pitch: 1, rate: 1 };
    }
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const gestureSvgRef = useRef(null);
  const gestureContainerRef = useRef(null);
  const streamRef = useRef(null);

  // Speak Function for Voice Feedback
  const speak = (text) => {
    if (!isVoiceEnabled || !window.speechSynthesis) {
      console.warn('Voice feedback disabled or Web Speech API not supported');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceSettings.language;
    utterance.pitch = voiceSettings.pitch;
    utterance.rate = voiceSettings.rate;
    window.speechSynthesis.speak(utterance);
  };

  // Persist Voice Settings
  useEffect(() => {
    try {
      localStorage.setItem('voiceEnabled', isVoiceEnabled);
      localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
    } catch (e) {
      console.warn('Unable to save to localStorage:', e);
    }
  }, [isVoiceEnabled, voiceSettings]);

  // Camera Handling
  const startCamera = async (facingMode = 'environment') => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser doesn't support camera access");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
        console.log('Camera stream started');
        setIsCameraActive(true);
        return true;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      // More detailed error handling
      if (err.name === 'NotAllowedError') {
        // Show Chrome-specific camera permission dialog
        openCameraPermissionHelp();
      } else if (err.name === 'NotFoundError') {
        alert('No camera detected. Please check your camera connection.');
      } else if (err.name === 'NotReadableError') {
        alert('Camera is already in use by another application.');
      } else {
        alert(`Camera error: ${err.message}`);
      }
      return false;
    }
  };
  
  // Browser-specific camera permission help
  const openCameraPermissionHelp = () => {
    // Custom dialog to help user enable camera in Chrome
    setShowModal('cameraPermissionHelp');
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
      console.log('Camera stopped');
    }
  };

  // Face Authentication
  const handleFaceScan = () => {
    // Check if camera was already denied - if so, show help dialog right away
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' })
        .then(permissionStatus => {
          console.log('Camera permission state:', permissionStatus.state);
          
          if (permissionStatus.state === 'denied') {
            // Permission already denied, show help directly
            openCameraPermissionHelp();
            return;
          } else {
            // Try to access camera
            proceedWithFaceScan();
          }
          
          // Listen for changes to permission state
          permissionStatus.onchange = () => {
            console.log('Camera permission state changed to:', permissionStatus.state);
            if (permissionStatus.state === 'granted') {
              proceedWithFaceScan();
            }
          };
        })
        .catch(error => {
          console.error('Permission query error:', error);
          // Fall back to trying camera access directly
          proceedWithFaceScan();
        });
    } else {
      // Browser doesn't support permission query - try directly
      proceedWithFaceScan();
    }
  };
  
  // Actually start the face scan process
  const proceedWithFaceScan = () => {
    setIsFaceScanning(true);
    
    // Directly request camera access through browser
    startCamera('user')
      .then(success => {
        if (success) {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setFaceScanProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setIsFaceScanning(false);
              stopCamera();
              setIsLoggedIn(true);
              setFaceScanProgress(0);
              speak('Login successful');
            }
          }, 500);
        } else {
          setIsFaceScanning(false);
        }
      })
      .catch(error => {
        setIsFaceScanning(false);
        console.error("Camera access failed:", error);
      });
  };

  // PIN Authentication
  const handlePinInput = (digit) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
    if (pin.length + 1 === 4) {
      setTimeout(() => {
        if (pin + digit === '1234') {
          setIsLoggedIn(true);
          setPin('');
          speak('Login successful');
        } else {
          setPin('');
          document.querySelectorAll('.pin-digit').forEach(el => el.classList.add('error'));
          setTimeout(() => document.querySelectorAll('.pin-digit').forEach(el => el.classList.remove('error')), 500);
        }
      }, 100);
    }
  };

  const handlePinClear = () => setPin('');
  const handlePinBackspace = () => setPin(pin.slice(0, -1));

  // Gesture Authentication
  const handleGestureStart = (e) => {
    e.preventDefault();
    setGesturePath([]);
    const rect = gestureContainerRef.current.getBoundingClientRect();
    const point = getGesturePoint(e, rect);
    setGesturePath([point]);
  };

  const handleGestureMove = (e) => {
    e.preventDefault();
    if (gesturePath.length > 0) {
      const rect = gestureContainerRef.current.getBoundingClientRect();
      const point = getGesturePoint(e, rect);
      setGesturePath([...gesturePath, point]);
    }
  };

  const handleGestureEnd = () => {
    if (gesturePath.length > 3) {
      setIsLoggedIn(true);
      setGesturePath([]);
      speak('Login successful');
    } else {
      setGesturePath([]);
    }
  };

  const getGesturePoint = (e, rect) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    const closestPoint = Math.floor(x * 3) + Math.floor(y * 3) * 3;
    return closestPoint;
  };

  useEffect(() => {
    if (gesturePath.length > 0 && gestureSvgRef.current) {
      const points = gesturePath.map(p => {
        const row = Math.floor(p / 3);
        const col = p % 3;
        return `${(col + 0.5) * 33.33}% ${(row + 0.5) * 33.33}%`;
      }).join(' ');
      gestureSvgRef.current.innerHTML = `<polyline points="${points}" stroke="#5f259f" stroke-width="5" fill="none"/>`;
    } else if (gestureSvgRef.current) {
      gestureSvgRef.current.innerHTML = '';
    }
  }, [gesturePath]);

  // Scanner Handling
  const handleScan = () => {
    setIsScanning(true);
    
    // Check if camera was already denied
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' })
        .then(permissionStatus => {
          console.log('Camera permission state:', permissionStatus.state);
          
          if (permissionStatus.state === 'denied') {
            // Permission already denied, show help directly
            openCameraPermissionHelp();
          } else {
            // Try to access camera
            startCamera('environment')
              .catch(error => {
                console.error("Camera access failed:", error);
              });
          }
        })
        .catch(error => {
          console.error('Permission query error:', error);
          // Fall back to trying camera access directly
          startCamera('environment')
            .catch(error => {
              console.error("Camera access failed:", error);
            });
        });
    } else {
      // Browser doesn't support permission query - try directly
      startCamera('environment')
        .catch(error => {
          console.error("Camera access failed:", error);
        });
    }
  };

  const handleSimulatedPayment = (amount) => {
    const newTransaction = {
      id: transactions.length + 1,
      name: 'Payment to Merchant',
      time: new Date().toLocaleTimeString(),
      amount: -amount,
      type: 'payment'
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance(balance - amount);
    setIsScanning(false);
    stopCamera();
    speak(`Payment of ${amount} rupees initiated`);
  };

  // Modal Handling
  const openModal = (type, data = {}) => {
    setShowModal(type);
    setModalData(data);
  };

  const closeModal = () => {
    setShowModal(null);
    setModalData({});
    setAmount('');
    setUpiId('');
    setMobileNumber('');
    setSelectedOperator(null);
    setSelectedPlan(null);
    setSelectedBillType(null);
    setSelectedProvider(null);
    setBillDetails(null);
  };

  const handleAddMoney = (amt) => {
    setAmount(amt);
    setBalance(balance + parseInt(amt));
    closeModal();
    const newTransaction = {
      id: transactions.length + 1,
      name: 'Money Added',
      time: new Date().toLocaleTimeString(),
      amount: parseInt(amt),
      type: 'received'
    };
    setTransactions([newTransaction, ...transactions]);
    speak(`Added ${amt} rupees to your balance`);
  };

  const handleConfirm = () => {
    if (showModal === 'sendMoney') {
      if (amount && upiId) {
        const newTransaction = {
          id: transactions.length + 1,
          name: `Sent to ${upiId}`,
          time: new Date().toLocaleTimeString(),
          amount: -parseInt(amount),
          type: 'payment'
        };
        setTransactions([newTransaction, ...transactions]);
        setBalance(balance - parseInt(amount));
        closeModal();
        speak(`Sent ${amount} rupees to ${upiId}`);
      }
    } else if (showModal === 'mobileRechargeConfirm') {
      if (selectedPlan) {
        const newTransaction = {
          id: transactions.length + 1,
          name: `Recharge for ${mobileNumber}`,
          time: new Date().toLocaleTimeString(),
          amount: -selectedPlan.price,
          type: 'mobile'
        };
        setTransactions([newTransaction, ...transactions]);
        setBalance(balance - selectedPlan.price);
        closeModal();
        speak(`Recharge of ${selectedPlan.price} rupees for ${mobileNumber} initiated`);
      }
    } else if (showModal === 'billPaymentConfirm') {
      if (billDetails) {
        const newTransaction = {
          id: transactions.length + 1,
          name: `Bill Payment for ${selectedProvider}`,
          time: new Date().toLocaleTimeString(),
          amount: -billDetails.amount,
          type: 'bill'
        };
        setTransactions([newTransaction, ...transactions]);
        setBalance(balance - billDetails.amount);
        closeModal();
        speak(`Bill payment of ${billDetails.amount} rupees for ${selectedProvider} initiated`);
      }
    }
  };

  // Navigation
  const handleNavClick = (screen) => {
    setCurrentScreen(screen);
    setShowNotifications(false);
  };

  // Voice Settings Modal
  const handleVoiceSettings = () => {
    openModal('voiceSettings');
  };

  const handleVoiceToggle = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    speak(isVoiceEnabled ? 'Voice feedback disabled' : 'Voice feedback enabled');
  };

  const handleVoiceSettingsChange = (e) => {
    const { name, value } = e.target;
    setVoiceSettings(prev => ({ ...prev, [name]: name === 'language' ? value : parseFloat(value) }));
  };

  // Render Components
  const renderLoginScreen = () => (
    <div className="login-screen">
      <div className="login-header">
        <div className="login-title">PhonePe</div>
        <Info className="info-icon" onClick={() => setShowInfoBox(true)} />
      </div>
      {showInfoBox && (
        <div className="login-info-box">
          <div className="login-info-title">How to use?</div>
          <ul className="login-info-list">
            <li>Face: Click "Start Face Scan" to simulate face authentication</li>
            <li>PIN: Enter 1234 as the PIN</li>
            <li>Gesture: Draw a pattern connecting at least 4 points</li>
          </ul>
          <button className="login-info-close" onClick={() => setShowInfoBox(false)}>Close</button>
        </div>
      )}
      <div className="login-methods">
        {['face', 'pin', 'gesture'].map(method => (
          <div
            key={method}
            className={`login-method-tab ${loginMethod === method ? 'active' : ''}`}
            onClick={() => setLoginMethod(method)}
          >
            {method === 'face' && <Camera />}
            {method === 'pin' && <Smartphone />}
            {method === 'gesture' && <Lightbulb />}
            <span>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
          </div>
        ))}
      </div>
      {loginMethod === 'face' && (
        <div className="face-auth-container">
          <div className="face-scanner">
            {isFaceScanning ? (
              <div className="face-scan-animation">
                <video ref={videoRef} className="face-video" autoPlay playsInline />
                <div className="face-scan-line"></div>
              </div>
            ) : (
              <>
                <Camera className="face-camera-icon" size={40} />
                <button className="face-auth-button" onClick={handleFaceScan}>Start Face Scan</button>
              </>
            )}
          </div>
          {isFaceScanning && (
            <div className="face-auth-progress">
              <div className="face-auth-progress-bar" style={{ width: `${faceScanProgress}%` }}></div>
            </div>
          )}
          <div className="face-auth-text">Position your face within the frame</div>
          <div className="auth-fallback-text">
            Having trouble? <span className="auth-switch-link" onClick={() => setLoginMethod('pin')}>Try PIN</span>
          </div>
        </div>
      )}
      {loginMethod === 'pin' && (
        <div className="pin-auth-container">
          <div className="pin-auth-text">Enter your 4-digit PIN</div>
          <div className="pin-display">
            {Array(4).fill().map((_, i) => (
              <div key={i} className={`pin-digit ${pin.length > i ? 'filled' : ''}`}>
                {pin[i] || ''}
              </div>
            ))}
          </div>
          <div className="pin-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'B'].map(key => (
              <button
                key={key}
                className={`pin-key ${key === 'C' ? 'pin-clear' : key === 'B' ? 'pin-backspace' : ''}`}
                onClick={() => {
                  if (key === 'C') handlePinClear();
                  else if (key === 'B') handlePinBackspace();
                  else handlePinInput(key);
                }}
                disabled={pin.length >= 4 && key !== 'C' && key !== 'B'}
              >
                {key === 'C' ? 'Clear' : key === 'B' ? '⌫' : key}
              </button>
            ))}
          </div>
          <div className="auth-fallback-text">
            Forgot PIN? <span className="auth-switch-link" onClick={() => setLoginMethod('gesture')}>Try Gesture</span>
          </div>
        </div>
      )}
      {loginMethod === 'gesture' && (
        <div className="gesture-auth-container">
          <div
            className={`gesture-grid ${gesturePath.length > 0 ? 'active' : ''}`}
            ref={gestureContainerRef}
            onMouseDown={handleGestureStart}
            onMouseMove={handleGestureMove}
            onMouseUp={handleGestureEnd}
            onTouchStart={handleGestureStart}
            onTouchMove={handleGestureMove}
            onTouchEnd={handleGestureEnd}
          >
            {Array(9).fill().map((_, i) => (
              <div
                key={i}
                className={`gesture-point ${gesturePath.includes(i) ? 'active' : ''}`}
              ></div>
            ))}
            <svg ref={gestureSvgRef} className="gesture-path-svg"></svg>
          </div>
          <div className="gesture-auth-text">Draw your gesture pattern</div>
          <button className="gesture-reset-button" onClick={() => setGesturePath([])}>Reset</button>
          <div className="auth-fallback-text">
            Forgot Gesture? <span className="auth-switch-link" onClick={() => setLoginMethod('face')}>Try Face</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderHomeScreen = () => (
    <div className="home-screen">
      <div className="balance-section">
        <div className="user-greeting">Hello, User!</div>
        <div className="balance-info">
          <div>
            <div className="balance-label">PhonePe Balance</div>
            <div className="balance-value">₹{balance}</div>
          </div>
          <button className="add-money-button" onClick={() => openModal('addMoney')}>
            <CreditCard size={16} /> Add Money
          </button>
        </div>
      </div>
      <div className="quick-actions">
        {[
          { icon: Send, text: 'Send Money', action: () => openModal('sendMoney') },
          { icon: Smartphone, text: 'Mobile Recharge', action: () => openModal('mobileRecharge') },
          { icon: QrCode, text: 'Scan & Pay', action: handleScan },
          { icon: Lightbulb, text: 'Pay Bills', action: () => openModal('billPayment') }
        ].map((item, i) => (
          <div key={i} className="action-item" onClick={() => { item.action(); speak(item.text); }}>
            <div className="action-icon"><item.icon /></div>
            <div className="action-text">{item.text}</div>
          </div>
        ))}
      </div>
      <div className="section-container">
        <div className="section-title">Transfer Money</div>
        <div className="transfers-grid">
          {[
            { icon: User, text: 'To Contact' },
            { icon: CreditCard, text: 'To Bank' },
            { icon: Smartphone, text: 'To Self' },
            { icon: QrCode, text: 'UPI ID' }
          ].map((item, i) => (
            <div key={i} className="transfer-item" onClick={() => openModal('sendMoney')}>
              <div className="transfer-icon"><item.icon /></div>
              <div className="transfer-text">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="section-container">
        <div className="section-title">Recent Transactions</div>
        <div className="transactions-list">
          {transactions.slice(0, 3).map(tx => (
            <div key={tx.id} className="transaction-item">
              <div className="transaction-left">
                <div className={`transaction-icon ${tx.type}`}>
                  {tx.type === 'payment' && <Send />}
                  {tx.type === 'received' && <CheckCircle />}
                  {tx.type === 'mobile' && <Smartphone />}
                  {tx.type === 'bill' && <Lightbulb />}
                </div>
                <div className="transaction-details">
                  <div className="transaction-name">{tx.name}</div>
                  <div className="transaction-time">{tx.time}</div>
                </div>
              </div>
              <div className={`transaction-amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
                {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScannerOverlay = () => (
    <div className="scanner-overlay">
      <div className="scanner-header">
        <div className="scanner-title">Scan QR Code</div>
        <X className="close-icon" onClick={() => { setIsScanning(false); stopCamera(); }} />
      </div>
      <div className="scanner-content">
        <div className="scanner-frame">
          {isCameraActive ? (
            <video ref={videoRef} className="scanner-video" autoPlay playsInline />
          ) : (
            <Camera className="camera-icon" size={40} />
          )}
          <div className="scan-area"></div>
          {!isCameraActive && (
            <div className="camera-access-message">
              Camera access is required for scanning
            </div>
          )}
        </div>
        <div className="scanner-text">Align the QR code within the frame</div>
        <div className="payment-simulator">
          <div className="simulator-title">Simulate Payment</div>
          {[100, 500, 1000].map(amt => (
            <button
              key={amt}
              className="payment-button"
              onClick={() => handleSimulatedPayment(amt)}
            >
              Pay ₹{amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          {showModal === 'addMoney' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Add Money</div>
                <X onClick={closeModal} />
              </div>
              <div className="add-money-options">
                <div className="add-money-text">Select amount to add</div>
                <div className="amount-options">
                  {[500, 1000, 2000, 5000].map(amt => (
                    <button
                      key={amt}
                      className="amount-option"
                      onClick={() => handleAddMoney(amt)}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <button className="cancel-button full-width" onClick={closeModal}>Cancel</button>
              </div>
            </>
          )}
          {showModal === 'sendMoney' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Send Money</div>
                <X onClick={closeModal} />
              </div>
              <form className="modal-form">
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <input
                    className="form-input"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@upi"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <div className="amount-input-container">
                    <span className="currency-symbol">₹</span>
                    <input
                      className="form-input amount-input"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="current-balance">Current Balance: <span className="balance-text">₹{balance}</span></div>
                </div>
                <div className="form-buttons">
                  <button className="cancel-button" onClick={closeModal}>Cancel</button>
                  <button
                    className={`confirm-button ${!amount || !upiId ? 'disabled' : ''}`}
                    onClick={handleConfirm}
                    disabled={!amount || !upiId}
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </>
          )}
          {showModal === 'mobileRecharge' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Mobile Recharge</div>
                <X onClick={closeModal} />
              </div>
              <form className="modal-form">
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Select Operator</label>
                  <div className="operators-grid">
                    {['Airtel', 'Jio', 'Vodafone', 'BSNL'].map(op => (
                      <div
                        key={op}
                        className={`operator-item ${selectedOperator === op ? 'selected' : ''}`}
                        onClick={() => setSelectedOperator(op)}
                      >
                        <div className="operator-logo">{op[0]}</div>
                        <div className="operator-name">{op}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className={`continue-button ${!mobileNumber || !selectedOperator ? 'disabled' : ''}`}
                  onClick={() => openModal('mobileRechargePlans')}
                  disabled={!mobileNumber || !selectedOperator}
                >
                  Continue
                </button>
              </form>
            </>
          )}
          {showModal === 'mobileRechargePlans' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Select Plan</div>
                <X onClick={closeModal} />
              </div>
              <div className="plans-list">
                {[
                  { price: 239, validity: '28 days', details: '1.5GB/day, Unlimited Calls' },
                  { price: 299, validity: '28 days', details: '2GB/day, Unlimited Calls' },
                  { price: 719, validity: '84 days', details: '2GB/day, Unlimited Calls' }
                ].map(plan => (
                  <div
                    key={plan.price}
                    className={`plan-item ${selectedPlan === plan ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="plan-header">
                      <div className="plan-price">₹{plan.price}</div>
                      <div className="plan-validity">{plan.validity}</div>
                    </div>
                    <div className="plan-details">{plan.details}</div>
                  </div>
                ))}
              </div>
              <div className="form-buttons">
                <button className="back-button" onClick={() => openModal('mobileRecharge')}>Back</button>
                <button
                  className={`pay-button ${!selectedPlan ? 'disabled' : ''}`}
                  onClick={() => openModal('mobileRechargeConfirm')}
                  disabled={!selectedPlan}
                >
                  Pay
                </button>
              </div>
            </>
          )}
          {showModal === 'mobileRechargeConfirm' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Confirm Recharge</div>
                <X onClick={closeModal} />
              </div>
              <div className="confirmation-box">
                <div className="confirmation-title">Recharge Details</div>
                <div className="confirmation-details">
                  <div className="confirmation-row">
                    <div className="confirmation-label">Mobile Number</div>
                    <div className="confirmation-value">{mobileNumber}</div>
                  </div>
                  <div className="confirmation-row">
                    <div className="confirmation-label">Operator</div>
                    <div className="confirmation-value">{selectedOperator}</div>
                  </div>
                  <div className="confirmation-row">
                    <div className="confirmation-label">Plan Amount</div>
                    <div className="confirmation-value bill-amount">₹{selectedPlan.price}</div>
                  </div>
                </div>
              </div>
              <div className="form-buttons">
                <button className="cancel-button" onClick={closeModal}>Cancel</button>
                <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
              </div>
            </>
          )}
          {showModal === 'billPayment' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Pay Bills</div>
                <X onClick={closeModal} />
              </div>
              <div className="bill-types-grid">
                {['Electricity', 'Water', 'Gas', 'Internet'].map(type => (
                  <div
                    key={type}
                    className={`bill-type-item ${selectedBillType === type ? 'active' : ''}`}
                    onClick={() => setSelectedBillType(type)}
                  >
                    <Lightbulb className="bill-type-icon" />
                    <div className="bill-type-name">{type}</div>
                  </div>
                ))}
              </div>
              <button
                className={`continue-button ${!selectedBillType ? 'disabled' : ''}`}
                onClick={() => openModal('billPaymentProvider')}
                disabled={!selectedBillType}
              >
                Continue
              </button>
            </>
          )}
          {showModal === 'billPaymentProvider' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Select Provider</div>
                <X onClick={closeModal} />
              </div>
              <div className="providers-list">
                {['Provider A', 'Provider B', 'Provider C'].map(provider => (
                  <div
                    key={provider}
                    className={`provider-item ${selectedProvider === provider ? 'selected' : ''}`}
                    onClick={() => setSelectedProvider(provider)}
                  >
                    <div className="provider-name">{provider}</div>
                  </div>
                ))}
              </div>
              <div className="form-buttons">
                <button className="back-button" onClick={() => openModal('billPayment')}>Back</button>
                <button
                  className={`fetch-bill-button ${!selectedProvider ? 'disabled' : ''}`}
                  onClick={() => {
                    setBillDetails({ amount: 1200, dueDate: '2023-10-15' });
                    openModal('billPaymentConfirm');
                  }}
                  disabled={!selectedProvider}
                >
                  Fetch Bill
                </button>
              </div>
            </>
          )}
          {showModal === 'billPaymentConfirm' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Confirm Bill Payment</div>
                <X onClick={closeModal} />
              </div>
              <div className="confirmation-box">
                <div className="confirmation-title">Bill Details</div>
                <div className="confirmation-details">
                  <div className="confirmation-row">
                    <div className="confirmation-label">Provider</div>
                    <div className="confirmation-value">{selectedProvider}</div>
                  </div>
                  <div className="confirmation-row">
                    <div className="confirmation-label">Bill Amount</div>
                    <div className="confirmation-value bill-amount">₹{billDetails.amount}</div>
                  </div>
                  <div className="confirmation-row">
                    <div className="confirmation-label">Due Date</div>
                    <div className="confirmation-value">{billDetails.dueDate}</div>
                  </div>
                </div>
              </div>
              <div className="form-buttons">
                <button className="cancel-button" onClick={closeModal}>Cancel</button>
                <button className="confirm-button" onClick={handleConfirm}>Pay</button>
              </div>
            </>
          )}
          {showModal === 'voiceSettings' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Voice Settings</div>
                <X onClick={closeModal} />
              </div>
              <form className="modal-form">
                <div className="form-group">
                  <label className="form-label">Voice Language</label>
                  <select
                    className="form-input"
                    name="language"
                    value={voiceSettings.language}
                    onChange={handleVoiceSettingsChange}
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="hi-IN">Hindi (India)</option>
                    <option value="es-ES">Spanish (Spain)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pitch ({voiceSettings.pitch})</label>
                  <input
                    className="form-input"
                    type="range"
                    name="pitch"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.pitch}
                    onChange={handleVoiceSettingsChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rate ({voiceSettings.rate})</label>
                  <input
                    className="form-input"
                    type="range"
                    name="rate"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.rate}
                    onChange={handleVoiceSettingsChange}
                  />
                </div>
                <button
                  className="continue-button"
                  onClick={() => {
                    speak('Voice settings updated');
                    closeModal();
                  }}
                >
                  Save
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderNotificationsPanel = () => (
    <div className="modal-overlay">
      <div className="notifications-panel">
        <div className="notifications-header">
          <div className="notifications-title">Notifications</div>
          <X onClick={() => setShowNotifications(false)} />
        </div>
        <div className="notifications-list">
          {[
            { title: 'Payment Received', desc: '₹500 from John Doe', time: '10:30 AM', unread: true },
            { title: 'Recharge Successful', desc: '₹239 for Airtel', time: 'Yesterday', unread: false }
          ].map((notif, i) => (
            <div key={i} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
              <div className="notification-title">{notif.title}</div>
              <div className="notification-desc">{notif.desc}</div>
              <div className="notification-time">{notif.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistoryScreen = () => (
    <div className="page-container">
      <div className="page-title">Transaction History</div>
      <div className="transactions-list">
        {transactions.map(tx => (
          <div key={tx.id} className="transaction-item">
            <div className="transaction-left">
              <div className={`transaction-icon ${tx.type}`}>
                {tx.type === 'payment' && <Send />}
                {tx.type === 'received' && <CheckCircle />}
                {tx.type === 'mobile' && <Smartphone />}
                {tx.type === 'bill' && <Lightbulb />}
              </div>
              <div className="transaction-details">
                <div className="transaction-name">{tx.name}</div>
                <div className="transaction-time">{tx.time}</div>
              </div>
            </div>
            <div className={`transaction-amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
              {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="phonepe-app">
      {isLoggedIn ? (
        <>
          <div className="app-header">
            <div className="header-left">
              <div className="app-title">PhonePe</div>
            </div>
            <div className="header-right">
              <Bell className="header-icon" onClick={() => setShowNotifications(true)} />
              {isVoiceEnabled ? (
                <Volume2 className="header-icon" onClick={handleVoiceSettings} />
              ) : (
                <VolumeX className="header-icon" onClick={handleVoiceToggle} />
              )}
            </div>
          </div>
          <div className="main-content">
            {currentScreen === 'home' && renderHomeScreen()}
            {currentScreen === 'history' && renderHistoryScreen()}
            {isScanning && renderScannerOverlay()}
          </div>
          <div className="bottom-nav">
            {[
              { icon: Home, text: 'Home', screen: 'home' },
              { icon: Store, text: 'Stores', screen: 'stores' },
              { icon: Shield, text: 'Insurance', screen: 'insurance' },
              { icon: DollarSign, text: 'Wealth', screen: 'wealth' },
              { icon: History, text: 'History', screen: 'history' }
            ].map((item, i) => (
              <div
                key={i}
                className={`nav-item ${currentScreen === item.screen ? 'active' : ''}`}
                onClick={() => handleNavClick(item.screen)}
              >
                <item.icon className="nav-icon" />
                <div className="nav-text">{item.text}</div>
              </div>
            ))}
          </div>
          {renderModal()}
          {showNotifications && renderNotificationsPanel()}
        </>
      ) : (
        renderLoginScreen()
      )}


    </div>
  );
};

export default PhonePeReplica;