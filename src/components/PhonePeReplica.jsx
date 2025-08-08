// import React, { useState, useEffect, useRef } from 'react';
// import './PhonePe.css';
// import { Camera, User, QrCode, Bell, Home, Store, History, Info, X, Send, Smartphone, CreditCard, Lightbulb, CheckCircle, ChevronRight, Volume2, VolumeX, Building, Users, Search, LogOut, Gift, Tv, Zap, FileText, Clock, Settings } from 'lucide-react';

// const PhonePeReplica = () => {
//   // State Management - Define all state variables at the beginning
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loginMethod, setLoginMethod] = useState('face');
//   const [showInfoBox, setShowInfoBox] = useState(false);
//   const [pin, setPin] = useState('');
//   const [gesturePath, setGesturePath] = useState([]);
//   const [isScanning, setIsScanning] = useState(false);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [isFaceScanning, setIsFaceScanning] = useState(false);
//   const [faceScanProgress, setFaceScanProgress] = useState(0);
//   const [currentScreen, setCurrentScreen] = useState('home');
//   const [showModal, setShowModal] = useState(null);
//   const [modalData, setModalData] = useState({});
//   const [amount, setAmount] = useState('');
//   const [upiId, setUpiId] = useState('');
//   const [selectedOperator, setSelectedOperator] = useState(null);
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [selectedBillType, setSelectedBillType] = useState(null);
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [billDetails, setBillDetails] = useState(null);
//   const [balance, setBalance] = useState(5000);
//   const [transactions, setTransactions] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [searchContact, setSearchContact] = useState('');
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [accountNumber, setAccountNumber] = useState('');
//   const [ifscCode, setIfscCode] = useState('');
//   const [bankName, setBankName] = useState('');

//   // Voice Feedback States
//   const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
//     try {
//       return localStorage.getItem('voiceEnabled') === 'true';
//     } catch (e) {
//       return false;
//     }
//   });

//   const [voiceSettings, setVoiceSettings] = useState(() => {
//     try {
//       const saved = localStorage.getItem('voiceSettings');
//       return saved ? JSON.parse(saved) : { language: 'en-US', pitch: 1, rate: 1 };
//     } catch (e) {
//       return { language: 'en-US', pitch: 1, rate: 1 };
//     }
//   });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const gestureSvgRef = useRef(null);
//   const gestureContainerRef = useRef(null);
//   const streamRef = useRef(null);

//   // Mock contact list
//   const contacts = [
//     { id: 1, name: 'John Doe', number: '9876543210', upiId: 'john@phonepe' },
//     { id: 2, name: 'Alice Smith', number: '8765432109', upiId: 'alice@phonepe' },
//     { id: 3, name: 'Bob Johnson', number: '7654321098', upiId: 'bob@phonepe' },
//     { id: 4, name: 'Emma Brown', number: '6543210987', upiId: 'emma@phonepe' },
//     { id: 5, name: 'Mike Wilson', number: '5432109876', upiId: 'mike@phonepe' }
//   ];

//   // Filtered contacts based on search
//   const filteredContacts = contacts.filter(contact =>
//     contact.name.toLowerCase().includes(searchContact.toLowerCase()) ||
//     contact.number.includes(searchContact)
//   );

//   // Speak Function for Voice Feedback
//   const speak = (text) => {
//     if (!isVoiceEnabled || !window.speechSynthesis) {
//       console.warn('Voice feedback disabled or Web Speech API not supported');
//       return;
//     }
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = voiceSettings.language;
//     utterance.pitch = voiceSettings.pitch;
//     utterance.rate = voiceSettings.rate;
//     window.speechSynthesis.speak(utterance);
//   };

//   // Persist Voice Settings
//   useEffect(() => {
//     try {
//       localStorage.setItem('voiceEnabled', isVoiceEnabled);
//       localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
//     } catch (e) {
//       console.warn('Unable to save to localStorage:', e);
//     }
//   }, [isVoiceEnabled, voiceSettings]);

//   // Camera Handling
//   const startCamera = async (facingMode = 'environment') => {
//     try {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//       }

//       // Check if getUserMedia is supported
//       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         throw new Error("Browser doesn't support camera access");
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode }
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//         streamRef.current = stream;
//         console.log('Camera stream started');
//         setIsCameraActive(true);
//         return true;
//       }
//     } catch (err) {
//       console.error('Error accessing camera:', err);

//       // More detailed error handling
//       if (err.name === 'NotAllowedError') {
//         // Show Chrome-specific camera permission dialog
//         openCameraPermissionHelp();
//       } else if (err.name === 'NotFoundError') {
//         alert('No camera detected. Please check your camera connection.');
//       } else if (err.name === 'NotReadableError') {
//         alert('Camera is already in use by another application.');
//       } else {
//         alert(`Camera error: ${err.message}`);
//       }
//       return false;
//     }
//   };

//   // Browser-specific camera permission help
//   const openCameraPermissionHelp = () => {
//     // Custom dialog to help user enable camera in Chrome
//     setShowModal('cameraPermissionHelp');
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//       streamRef.current = null;
//       setIsCameraActive(false);
//       console.log('Camera stopped');
//     }
//   };

//   // Face Authentication
//   const handleFaceScan = () => {
//     // Check if camera was already denied - if so, show help dialog right away
//     if (navigator.permissions && navigator.permissions.query) {
//       navigator.permissions.query({ name: 'camera' })
//         .then(permissionStatus => {
//           console.log('Camera permission state:', permissionStatus.state);

//           if (permissionStatus.state === 'denied') {
//             // Permission already denied, show help directly
//             openCameraPermissionHelp();
//             return;
//           } else {
//             // Try to access camera
//             proceedWithFaceScan();
//           }

//           // Listen for changes to permission state
//           permissionStatus.onchange = () => {
//             console.log('Camera permission state changed to:', permissionStatus.state);
//             if (permissionStatus.state === 'granted') {
//               proceedWithFaceScan();
//             }
//           };
//         })
//         .catch(error => {
//           console.error('Permission query error:', error);
//           // Fall back to trying camera access directly
//           proceedWithFaceScan();
//         });
//     } else {
//       // Browser doesn't support permission query - try directly
//       proceedWithFaceScan();
//     }
//   };

//   // Actually start the face scan process
//   const proceedWithFaceScan = () => {
//     setIsFaceScanning(true);

//     // Directly request camera access through browser
//     startCamera('user')
//       .then(success => {
//         if (success) {
//           let progress = 0;
//           const interval = setInterval(() => {
//             progress += 10;
//             setFaceScanProgress(progress);
//             if (progress >= 100) {
//               clearInterval(interval);
//               setIsFaceScanning(false);
//               stopCamera();
//               setIsLoggedIn(true);
//               setFaceScanProgress(0);
//               speak('Login successful');
//             }
//           }, 500);
//         } else {
//           setIsFaceScanning(false);
//         }
//       })
//       .catch(error => {
//         setIsFaceScanning(false);
//         console.error("Camera access failed:", error);
//       });
//   };

//   // PIN Authentication
//   const handlePinInput = (digit) => {
//     if (pin.length < 4) {
//       setPin(pin + digit);
//     }
//     if (pin.length + 1 === 4) {
//       setTimeout(() => {
//         if (pin + digit === '1234') {
//           setIsLoggedIn(true);
//           setPin('');
//           speak('Login successful');
//         } else {
//           setPin('');
//           document.querySelectorAll('.pin-digit').forEach(el => el.classList.add('error'));
//           setTimeout(() => document.querySelectorAll('.pin-digit').forEach(el => el.classList.remove('error')), 500);
//         }
//       }, 100);
//     }
//   };

//   const handlePinClear = () => setPin('');
//   const handlePinBackspace = () => setPin(pin.slice(0, -1));

//   // Gesture Authentication
//   const handleGestureStart = (e) => {
//     e.preventDefault();
//     setGesturePath([]);
//     const rect = gestureContainerRef.current.getBoundingClientRect();
//     const point = getGesturePoint(e, rect);
//     setGesturePath([point]);
//   };

//   const handleGestureMove = (e) => {
//     e.preventDefault();
//     if (gesturePath.length > 0) {
//       const rect = gestureContainerRef.current.getBoundingClientRect();
//       const point = getGesturePoint(e, rect);
//       setGesturePath([...gesturePath, point]);
//     }
//   };

//   const handleGestureEnd = () => {
//     if (gesturePath.length > 3) {
//       setIsLoggedIn(true);
//       setGesturePath([]);
//       speak('Login successful');
//     } else {
//       setGesturePath([]);
//     }
//   };

//   const getGesturePoint = (e, rect) => {
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//     const x = (clientX - rect.left) / rect.width;
//     const y = (clientY - rect.top) / rect.height;
//     const closestPoint = Math.floor(x * 3) + Math.floor(y * 3) * 3;
//     return closestPoint;
//   };

//   useEffect(() => {
//     if (gesturePath.length > 0 && gestureSvgRef.current) {
//       const points = gesturePath.map(p => {
//         const row = Math.floor(p / 3);
//         const col = p % 3;
//         return `${(col + 0.5) * 33.33}% ${(row + 0.5) * 33.33}%`;
//       }).join(' ');
//       gestureSvgRef.current.innerHTML = `<polyline points="${points}" stroke="#5f259f" stroke-width="5" fill="none"/>`;
//     } else if (gestureSvgRef.current) {
//       gestureSvgRef.current.innerHTML = '';
//     }
//   }, [gesturePath]);

//   // Scanner Handling
//   const handleScan = () => {
//     setIsScanning(true);

//     setTimeout(() => {
//       // Check if camera was already denied
//       if (navigator.permissions && navigator.permissions.query) {
//         navigator.permissions.query({ name: 'camera' })
//           .then(permissionStatus => {
//             console.log('Camera permission state:', permissionStatus.state);

//             if (permissionStatus.state === 'denied') {
//               // Permission already denied, show help directly
//               openCameraPermissionHelp();
//             } else {
//               // Try to access camera
//               startCamera('environment')
//                 .catch(error => {
//                   console.error("Camera access failed:", error);
//                 });
//             }
//           })
//           .catch(error => {
//             console.error('Permission query error:', error);
//             // Fall back to trying camera access directly
//             startCamera('environment')
//               .catch(error => {
//                 console.error("Camera access failed:", error);
//               });
//           });
//       } else {
//         // Browser doesn't support permission query - try directly
//         startCamera('environment')
//           .catch(error => {
//             console.error("Camera access failed:", error);
//           });
//       }
//     }, 500); // Added a slight delay to ensure UI is rendered before camera initialization
//   };

//   const handleSimulatedPayment = (amount) => {
//     const newTransaction = {
//       id: transactions.length + 1,
//       name: 'Payment to Merchant',
//       time: new Date().toLocaleTimeString(),
//       amount: -amount,
//       type: 'payment'
//     };
//     setTransactions([newTransaction, ...transactions]);
//     setBalance(balance - amount);
//     setIsScanning(false);
//     stopCamera();
//     speak(`Payment of ${amount} rupees initiated`);
//   };

//   // Modal Handling
//   const openModal = (type, data = {}) => {
//     setShowModal(type);
//     setModalData(data);
//   };

//   const closeModal = () => {
//     setShowModal(null);
//     setModalData({});
//     setAmount('');
//     setUpiId('');
//     setMobileNumber('');
//     setSelectedOperator(null);
//     setSelectedPlan(null);
//     setSelectedBillType(null);
//     setSelectedProvider(null);
//     setBillDetails(null);
//     setSearchContact('');
//     setSelectedContact(null);
//     setAccountNumber('');
//     setIfscCode('');
//     setBankName('');
//   };

//   const handleAddMoney = (amt) => {
//     setAmount(amt);
//     setBalance(balance + parseInt(amt));
//     closeModal();
//     const newTransaction = {
//       id: transactions.length + 1,
//       name: 'Money Added',
//       time: new Date().toLocaleTimeString(),
//       amount: parseInt(amt),
//       type: 'received'
//     };
//     setTransactions([newTransaction, ...transactions]);
//     speak(`Added ${amt} rupees to your balance`);
//   };

//   const handleConfirm = () => {
//     if (showModal === 'sendToUPI') {
//       if (amount && upiId) {
//         const newTransaction = {
//           id: transactions.length + 1,
//           name: `Sent to ${upiId}`,
//           time: new Date().toLocaleTimeString(),
//           amount: -parseInt(amount),
//           type: 'payment'
//         };
//         setTransactions([newTransaction, ...transactions]);
//         setBalance(balance - parseInt(amount));
//         closeModal();
//         speak(`Sent ${amount} rupees to ${upiId}`);
//       }
//     } else if (showModal === 'sendToContact') {
//       if (amount && selectedContact) {
//         const newTransaction = {
//           id: transactions.length + 1,
//           name: `Sent to ${selectedContact.name}`,
//           time: new Date().toLocaleTimeString(),
//           amount: -parseInt(amount),
//           type: 'payment'
//         };
//         setTransactions([newTransaction, ...transactions]);
//         setBalance(balance - parseInt(amount));
//         closeModal();
//         speak(`Sent ${amount} rupees to ${selectedContact.name}`);
//       }
//     } else if (showModal === 'sendToBank') {
//       if (amount && accountNumber && ifscCode && bankName) {
//         const newTransaction = {
//           id: transactions.length + 1,
//           name: `Bank Transfer to ${bankName}`,
//           time: new Date().toLocaleTimeString(),
//           amount: -parseInt(amount),
//           type: 'payment'
//         };
//         setTransactions([newTransaction, ...transactions]);
//         setBalance(balance - parseInt(amount));
//         closeModal();
//         speak(`Sent ${amount} rupees to bank account`);
//       }
//     } else if (showModal === 'sendToSelf') {
//       if (amount) {
//         const newTransaction = {
//           id: transactions.length + 1,
//           name: `Self Transfer`,
//           time: new Date().toLocaleTimeString(),
//           amount: -parseInt(amount),
//           type: 'payment'
//         };
//         setTransactions([newTransaction, ...transactions]);
//         // No need to deduct from balance since it's self-transfer
//         closeModal();
//         speak(`Self transfer of ${amount} rupees initiated`);
//       }
//     } else if (showModal === 'mobileRechargeConfirm') {
//       if (selectedPlan) {
//         const newTransaction = {
//           id: transactions.length + 1,
//           name: `Recharge for ${mobileNumber}`,
//           time: new Date().toLocaleTimeString(),
//           amount: -selectedPlan.price,
//           type: 'mobile'
//         };
//         setTransactions([newTransaction, ...transactions]);
//         setBalance(balance - selectedPlan.price);
//         closeModal();
//         speak(`Recharge of ${selectedPlan.price} rupees for ${mobileNumber} initiated`);
//       }
//     } else if (showModal === 'billPaymentConfirm') {
//       if (billDetails) {
//         const newTransaction = {
//           id: transactions.length + 1,
//           name: `Bill Payment for ${selectedProvider}`,
//           time: new Date().toLocaleTimeString(),
//           amount: -billDetails.amount,
//           type: 'bill'
//         };
//         setTransactions([newTransaction, ...transactions]);
//         setBalance(balance - billDetails.amount);
//         closeModal();
//         speak(`Bill payment of ${billDetails.amount} rupees for ${selectedProvider} initiated`);
//       }
//     }
//   };

//   // Navigation
//   const handleNavClick = (screen) => {
//     setCurrentScreen(screen);
//     setShowNotifications(false);
//   };

//   // Handle Logout
//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setPin('');
//     setGesturePath([]);
//     setCurrentScreen('home');
//     setShowNotifications(false);
//     speak('Logged out successfully');
//   };

//   // Voice Settings Modal
//   const handleVoiceSettings = () => {
//     openModal('voiceSettings');
//   };

//   const handleVoiceToggle = () => {
//     setIsVoiceEnabled(!isVoiceEnabled);
//     speak(isVoiceEnabled ? 'Voice feedback disabled' : 'Voice feedback enabled');
//   };

//   const handleVoiceSettingsChange = (e) => {
//     const { name, value } = e.target;
//     setVoiceSettings(prev => ({ ...prev, [name]: name === 'language' ? value : parseFloat(value) }));
//   };

//   // Render Components
//   const renderLoginScreen = () => (
//     <div className="login-screen">
//       <div className="login-header">
//         <div className="login-title">PhonePe</div>
//         <Info className="info-icon" onClick={() => setShowInfoBox(true)} />
//       </div>
//       {showInfoBox && (
//         <div className="login-info-box">
//           <div className="login-info-title">How to use?</div>
//           <ul className="login-info-list">
//             <li>Face: Click "Start Face Scan" to simulate face authentication</li>
//             <li>PIN: Enter 1234 as the PIN</li>
//             <li>Gesture: Draw a pattern connecting at least 4 points</li>
//           </ul>
//           <button className="login-info-close" onClick={() => setShowInfoBox(false)}>Close</button>
//         </div>
//       )}
//       <div className="login-methods">
//         {['face', 'pin', 'gesture'].map(method => (
//           <div
//             key={method}
//             className={`login-method-tab ${loginMethod === method ? 'active' : ''}`}
//             onClick={() => setLoginMethod(method)}
//           >
//             {method === 'face' && <Camera />}
//             {method === 'pin' && <Smartphone />}
//             {method === 'gesture' && <Lightbulb />}
//             <span>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
//           </div>
//         ))}
//       </div>
//       {loginMethod === 'face' && (
//         <div className="face-auth-container">
//           <div className="face-scanner">
//             {isFaceScanning ? (
//               <div className="face-scan-animation">
//                 <video ref={videoRef} className="face-video" autoPlay playsInline />
//                 <div className="face-scan-line"></div>
//               </div>
//             ) : (
//               <>
//                 <Camera className="face-camera-icon" size={40} />
//                 <button className="face-auth-button" onClick={handleFaceScan}>Start Face Scan</button>
//               </>
//             )}
//           </div>
//           {isFaceScanning && (
//             <div className="face-auth-progress">
//               <div className="face-auth-progress-bar" style={{ width: `${faceScanProgress}%` }}></div>
//             </div>
//           )}
//           <div className="face-auth-text">Position your face within the frame</div>
//           <div className="auth-fallback-text">
//             Having trouble? <span className="auth-switch-link" onClick={() => setLoginMethod('pin')}>Try PIN</span>
//           </div>
//         </div>
//       )}
//       {loginMethod === 'pin' && (
//         <div className="pin-auth-container">
//           <div className="pin-auth-text">Enter your 4-digit PIN</div>
//           <div className="pin-display">
//             {Array(4).fill().map((_, i) => (
//               <div key={i} className={`pin-digit ${pin.length > i ? 'filled' : ''}`}>
//                 {pin[i] || ''}
//               </div>
//             ))}
//           </div>
//           <div className="pin-keypad">
//             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'B'].map(key => (
//               <button
//                 key={key}
//                 className={`pin-key ${key === 'C' ? 'pin-clear' : key === 'B' ? 'pin-backspace' : ''}`}
//                 onClick={() => {
//                   if (key === 'C') handlePinClear();
//                   else if (key === 'B') handlePinBackspace();
//                   else handlePinInput(key);
//                 }}
//                 disabled={pin.length >= 4 && key !== 'C' && key !== 'B'}
//               >
//                 {key === 'C' ? 'Clear' : key === 'B' ? '⌫' : key}
//               </button>
//             ))}
//           </div>
//           <div className="auth-fallback-text">
//             Forgot PIN? <span className="auth-switch-link" onClick={() => setLoginMethod('gesture')}>Try Gesture</span>
//           </div>
//         </div>
//       )}
//       {loginMethod === 'gesture' && (
//         <div className="gesture-auth-container">
//           <div
//             className={`gesture-grid ${gesturePath.length > 0 ? 'active' : ''}`}
//             ref={gestureContainerRef}
//             onMouseDown={handleGestureStart}
//             onMouseMove={handleGestureMove}
//             onMouseUp={handleGestureEnd}
//             onTouchStart={handleGestureStart}
//             onTouchMove={handleGestureMove}
//             onTouchEnd={handleGestureEnd}
//           >
//             {Array(9).fill().map((_, i) => (
//               <div
//                 key={i}
//                 className={`gesture-point ${gesturePath.includes(i) ? 'active' : ''}`}
//               ></div>
//             ))}
//             <svg ref={gestureSvgRef} className="gesture-path-svg"></svg>
//           </div>
//           <div className="gesture-auth-text">Draw your gesture pattern</div>
//           <button className="gesture-reset-button" onClick={() => setGesturePath([])}>Reset</button>
//           <div className="auth-fallback-text">
//             Forgot Gesture? <span className="auth-switch-link" onClick={() => setLoginMethod('face')}>Try Face</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const renderHomeScreen = () => (
//     <div className="home-screen">
//       <div className="balance-section">
//         <div className="user-greeting">Hello, User!</div>
//         <div className="balance-info">
//           <div>
//             <div className="balance-label">PhonePe Balance</div>
//             <div className="balance-value">₹{balance}</div>
//           </div>
//           <button className="add-money-button" onClick={() => openModal('addMoney')}>
//             <CreditCard size={16} /> Add Money
//           </button>
//         </div>
//       </div>
//       <div className="quick-actions">
//         {[
//           { icon: Send, text: 'Send Money', action: () => openModal('sendToUPI') },
//           { icon: Smartphone, text: 'Mobile Recharge', action: () => openModal('mobileRecharge') },
//           { icon: QrCode, text: 'Scan & Pay', action: handleScan },
//           { icon: Lightbulb, text: 'Electricity', action: () => openModal('billPayment') }
//         ].map((item, i) => (
//           <div key={i} className="action-item" onClick={() => { item.action(); speak(item.text); }}>
//             <div className="action-icon"><item.icon /></div>
//             <div className="action-text">{item.text}</div>
//           </div>
//         ))}
//       </div>
//       <div className="section-container">
//         <div className="section-title">Recharges & Bills</div>
//         <div className="transfers-grid">
//           {[
//             { icon: Tv, text: 'DTH', action: () => openModal('dthRecharge') },
//             { icon: Zap, text: 'Electricity', action: () => openModal('billPayment') },
//             { icon: FileText, text: 'Credit Card', action: () => openModal('creditCardBill') },
//             { icon: Clock, text: 'Rent Payment', action: () => openModal('rentPayment') }
//           ].map((item, i) => (
//             <div key={i} className="transfer-item" onClick={() => { item.action(); speak(item.text); }}>
//               <div className="transfer-icon"><item.icon /></div>
//               <div className="transfer-text">{item.text}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="section-container">
//         <div className="section-title">Transfer Money</div>
//         <div className="transfers-grid">
//           {[
//             { icon: User, text: 'To Contact', action: () => openModal('sendToContact') },
//             { icon: Building, text: 'To Bank', action: () => openModal('sendToBank') },
//             { icon: Users, text: 'To Self', action: () => openModal('sendToSelf') },
//             { icon: QrCode, text: 'UPI ID', action: () => openModal('sendToUPI') }
//           ].map((item, i) => (
//             <div key={i} className="transfer-item" onClick={() => { item.action(); speak(item.text); }}>
//               <div className="transfer-icon"><item.icon /></div>
//               <div className="transfer-text">{item.text}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="section-container">
//         <div className="section-title">Recent Transactions</div>
//         <div className="transactions-list">
//           {transactions.slice(0, 3).map(tx => (
//             <div key={tx.id} className="transaction-item">
//               <div className="transaction-left">
//                 <div className={`transaction-icon ${tx.type}`}>
//                   {tx.type === 'payment' && <Send />}
//                   {tx.type === 'received' && <CheckCircle />}
//                   {tx.type === 'mobile' && <Smartphone />}
//                   {tx.type === 'bill' && <Lightbulb />}
//                 </div>
//                 <div className="transaction-details">
//                   <div className="transaction-name">{tx.name}</div>
//                   <div className="transaction-time">{tx.time}</div>
//                 </div>
//               </div>
//               <div className={`transaction-amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
//                 {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount)}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderScannerOverlay = () => (
//     <div className="scanner-overlay">
//       <div className="scanner-header">
//         <div className="scanner-title">Scan QR Code</div>
//         <X className="close-icon" onClick={() => { setIsScanning(false); stopCamera(); }} />
//       </div>
//       <div className="scanner-content">
//         <div className="scanner-frame">
//           {isCameraActive ? (
//             <video ref={videoRef} className="scanner-video" autoPlay playsInline />
//           ) : (
//             <Camera className="camera-icon" size={40} />
//           )}
//           <div className="scan-area"></div>
//           {!isCameraActive && (
//             <div className="camera-access-message">
//               Camera access is required for scanning
//             </div>
//           )}
//         </div>
//         <div className="scanner-text">Align the QR code within the frame</div>
//         <div className="payment-simulator">
//           <div className="simulator-title">Simulate Payment</div>
//           {[100, 500, 1000].map(amt => (
//             <button
//               key={amt}
//               className="payment-button"
//               onClick={() => handleSimulatedPayment(amt)}
//             >
//               Pay ₹{amt}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderModal = () => {
//     if (!showModal) return null;
//     return (
//       <div className="modal-overlay">
//         <div className="modal-container">
//           {showModal === 'addMoney' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Add Money</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <div className="add-money-options">
//                 <div className="add-money-text">Select amount to add</div>
//                 <div className="amount-options">
//                   {[500, 1000, 2000, 5000].map(amt => (
//                     <button
//                       key={amt}
//                       className="amount-option"
//                       onClick={() => handleAddMoney(amt)}
//                     >
//                       ₹{amt}
//                     </button>
//                   ))}
//                 </div>
//                 <button className="cancel-button full-width" onClick={closeModal}>Cancel</button>
//               </div>
//             </>
//           )}
//           {showModal === 'sendToUPI' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Send Money to UPI ID</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="form-group">
//                   <label className="form-label">UPI ID</label>
//                   <input
//                     className="form-input"
//                     type="text"
//                     value={upiId}
//                     onChange={(e) => setUpiId(e.target.value)}
//                     placeholder="example@upi"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Amount</label>
//                   <div className="amount-input-container">
//                     <span className="currency-symbol">₹</span>
//                     <input
//                       className="form-input amount-input"
//                       type="number"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       placeholder="Enter amount"
//                     />
//                   </div>
//                   <div className="current-balance">Current Balance: <span className="balance-text">₹{balance}</span></div>
//                 </div>
//                 <div className="form-buttons">
//                   <button className="cancel-button" onClick={closeModal}>Cancel</button>
//                   <button
//                     className={`confirm-button ${!amount || !upiId ? 'disabled' : ''}`}
//                     onClick={handleConfirm}
//                     disabled={!amount || !upiId}
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//           {showModal === 'sendToContact' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Send Money to Contact</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="form-group">
//                   <label className="form-label">Search Contact</label>
//                   <div className="search-input-container">
//                     <Search className="search-icon" size={16} />
//                     <input
//                       className="form-input search-input"
//                       type="text"
//                       value={searchContact}
//                       onChange={(e) => setSearchContact(e.target.value)}
//                       placeholder="Name or phone number"
//                     />
//                   </div>
//                 </div>
//                 <div className="contacts-list">
//                   {filteredContacts.map(contact => (
//                     <div 
//                       key={contact.id} 
//                       className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
//                       onClick={() => setSelectedContact(contact)}
//                     >
//                       <div className="contact-avatar">{contact.name.charAt(0)}</div>
//                       <div className="contact-info">
//                         <div className="contact-name">{contact.name}</div>
//                         <div className="contact-number">{contact.number}</div>
//                       </div>
//                       {selectedContact?.id === contact.id && (
//                         <CheckCircle className="selected-icon" size={16} />
//                       )}
//                     </div>
//                   ))}
//                   {searchContact && filteredContacts.length === 0 && (
//                     <div className="no-contacts">No contacts found</div>
//                   )}
//                 </div>
//                 {selectedContact && (
//                   <div className="form-group">
//                     <label className="form-label">Amount</label>
//                     <div className="amount-input-container">
//                       <span className="currency-symbol">₹</span>
//                       <input
//                         className="form-input amount-input"
//                         type="number"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder="Enter amount"
//                       />
//                     </div>
//                     <div className="current-balance">Current Balance: <span className="balance-text">₹{balance}</span></div>
//                   </div>
//                 )}
//                 <div className="form-buttons">
//                   <button className="cancel-button" onClick={closeModal}>Cancel</button>
//                   <button
//                     className={`confirm-button ${!amount || !selectedContact ? 'disabled' : ''}`}
//                     onClick={handleConfirm}
//                     disabled={!amount || !selectedContact}
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//           {showModal === 'sendToBank' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Send Money to Bank Account</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="form-group">
//                   <label className="form-label">Bank Name</label>
//                   <input
//                     className="form-input"
//                     type="text"
//                     value={bankName}
//                     onChange={(e) => setBankName(e.target.value)}
//                     placeholder="Enter bank name"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Account Number</label>
//                   <input
//                     className="form-input"
//                     type="text"
//                     value={accountNumber}
//                     onChange={(e) => setAccountNumber(e.target.value)}
//                     placeholder="Enter account number"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">IFSC Code</label>
//                   <input
//                     className="form-input"
//                     type="text"
//                     value={ifscCode}
//                     onChange={(e) => setIfscCode(e.target.value)}
//                     placeholder="Enter IFSC code"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Amount</label>
//                   <div className="amount-input-container">
//                     <span className="currency-symbol">₹</span>
//                     <input
//                       className="form-input amount-input"
//                       type="number"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       placeholder="Enter amount"
//                     />
//                   </div>
//                   <div className="current-balance">Current Balance: <span className="balance-text">₹{balance}</span></div>
//                 </div>
//                 <div className="form-buttons">
//                   <button className="cancel-button" onClick={closeModal}>Cancel</button>
//                   <button
//                     className={`confirm-button ${!amount || !accountNumber || !ifscCode || !bankName ? 'disabled' : ''}`}
//                     onClick={handleConfirm}
//                     disabled={!amount || !accountNumber || !ifscCode || !bankName}
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//           {showModal === 'sendToSelf' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Transfer to Your Accounts</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="self-accounts-list">
//                   <div className="self-account-item selected">
//                     <div className="account-icon"><Building size={24} /></div>
//                     <div className="account-info">
//                       <div className="account-name">HDFC Bank</div>
//                       <div className="account-number">XXXX4567</div>
//                     </div>
//                     <CheckCircle className="selected-icon" size={16} />
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Amount</label>
//                   <div className="amount-input-container">
//                     <span className="currency-symbol">₹</span>
//                     <input
//                       className="form-input amount-input"
//                       type="number"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       placeholder="Enter amount"
//                     />
//                   </div>
//                   <div className="current-balance">Current Balance: <span className="balance-text">₹{balance}</span></div>
//                 </div>
//                 <div className="self-transfer-note">
//                   <Info size={16} />
//                   <span>Money will be transferred to your selected account within 24 hours</span>
//                 </div>
//                 <div className="form-buttons">
//                   <button className="cancel-button" onClick={closeModal}>Cancel</button>
//                   <button
//                     className={`confirm-button ${!amount ? 'disabled' : ''}`}
//                     onClick={handleConfirm}
//                     disabled={!amount}
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//           {showModal === 'mobileRecharge' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Mobile Recharge</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="form-group">
//                   <label className="form-label">Mobile Number</label>
//                   <input
//                     className="form-input"
//                     type="tel"
//                     value={mobileNumber}
//                     onChange={(e) => setMobileNumber(e.target.value)}
//                     placeholder="Enter mobile number"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Select Operator</label>
//                   <div className="operators-grid">
//                     {['Airtel', 'Jio', 'Vodafone', 'BSNL'].map(op => (
//                       <div
//                         key={op}
//                         className={`operator-item ${selectedOperator === op ? 'selected' : ''}`}
//                         onClick={() => setSelectedOperator(op)}
//                       >
//                         <div className="operator-logo">{op[0]}</div>
//                         <div className="operator-name">{op}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   className={`continue-button ${!mobileNumber || !selectedOperator ? 'disabled' : ''}`}
//                   onClick={() => openModal('mobileRechargePlans')}
//                   disabled={!mobileNumber || !selectedOperator}
//                 >
//                   Continue
//                 </button>
//               </form>
//             </>
//           )}
//           {showModal === 'mobileRechargePlans' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Select Plan</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <div className="plans-list">
//                 {[
//                   { price: 239, validity: '28 days', details: '1.5GB/day, Unlimited Calls' },
//                   { price: 299, validity: '28 days', details: '2GB/day, Unlimited Calls' },
//                   { price: 719, validity: '84 days', details: '2GB/day, Unlimited Calls' }
//                 ].map(plan => (
//                   <div
//                     key={plan.price}
//                     className={`plan-item ${selectedPlan === plan ? 'selected' : ''}`}
//                     onClick={() => setSelectedPlan(plan)}
//                   >
//                     <div className="plan-header">
//                       <div className="plan-price">₹{plan.price}</div>
//                       <div className="plan-validity">{plan.validity}</div>
//                     </div>
//                     <div className="plan-details">{plan.details}</div>
//                   </div>
//                 ))}
//               </div>
//               <div className="form-buttons">
//                 <button className="back-button" onClick={() => openModal('mobileRecharge')}>Back</button>
//                 <button
//                   className={`pay-button ${!selectedPlan ? 'disabled' : ''}`}
//                   onClick={() => openModal('mobileRechargeConfirm')}
//                   disabled={!selectedPlan}
//                 >
//                   Pay
//                 </button>
//               </div>
//             </>
//           )}
//           {showModal === 'mobileRechargeConfirm' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Confirm Recharge</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <div className="confirmation-box">
//                 <div className="confirmation-title">Recharge Details</div>
//                 <div className="confirmation-details">
//                   <div className="confirmation-row">
//                     <div className="confirmation-label">Mobile Number</div>
//                     <div className="confirmation-value">{mobileNumber}</div>
//                   </div>
//                   <div className="confirmation-row">
//                     <div className="confirmation-label">Operator</div>
//                     <div className="confirmation-value">{selectedOperator}</div>
//                   </div>
//                   <div className="confirmation-row">
//                     <div className="confirmation-label">Plan Amount</div>
//                     <div className="confirmation-value bill-amount">₹{selectedPlan.price}</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="form-buttons">
//                 <button className="cancel-button" onClick={closeModal}>Cancel</button>
//                 <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
//               </div>
//             </>
//           )}
//           {showModal === 'billPayment' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Pay Bills</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <div className="bill-types-grid">
//                 {['Electricity', 'Water', 'Gas', 'Internet'].map(type => (
//                   <div
//                     key={type}
//                     className={`bill-type-item ${selectedBillType === type ? 'active' : ''}`}
//                     onClick={() => setSelectedBillType(type)}
//                   >
//                     <Lightbulb className="bill-type-icon" />
//                     <div className="bill-type-name">{type}</div>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 className={`continue-button ${!selectedBillType ? 'disabled' : ''}`}
//                 onClick={() => openModal('billPaymentProvider')}
//                 disabled={!selectedBillType}
//               >
//                 Continue
//               </button>
//             </>
//           )}
//           {showModal === 'billPaymentProvider' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Select Provider</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <div className="providers-list">
//                 {['Provider A', 'Provider B', 'Provider C'].map(provider => (
//                   <div
//                     key={provider}
//                     className={`provider-item ${selectedProvider === provider ? 'selected' : ''}`}
//                     onClick={() => setSelectedProvider(provider)}
//                   >
//                     <div className="provider-name">{provider}</div>
//                   </div>
//                 ))}
//               </div>
//               <div className="form-buttons">
//                 <button className="back-button" onClick={() => openModal('billPayment')}>Back</button>
//                 <button
//                   className={`fetch-bill-button ${!selectedProvider ? 'disabled' : ''}`}
//                   onClick={() => {
//                     setBillDetails({ amount: 1200, dueDate: '2023-10-15' });
//                     openModal('billPaymentConfirm');
//                   }}
//                   disabled={!selectedProvider}
//                 >
//                   Fetch Bill
//                 </button>
//               </div>
//             </>
//           )}
//           {showModal === 'billPaymentConfirm' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Confirm Bill Payment</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <div className="confirmation-box">
//                 <div className="confirmation-title">Bill Details</div>
//                 <div className="confirmation-details">
//                   <div className="confirmation-row">
//                     <div className="confirmation-label">Provider</div>
//                     <div className="confirmation-value">{selectedProvider}</div>
//                   </div>
//                   <div className="confirmation-row">
//                     <div className="confirmation-label">Bill Amount</div>
//                     <div className="confirmation-value bill-amount">₹{billDetails.amount}</div>
//                   </div>
//                   <div className="confirmation-row">
//                     <div className="confirmation-label">Due Date</div>
//                     <div className="confirmation-value">{billDetails.dueDate}</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="form-buttons">
//                 <button className="cancel-button" onClick={closeModal} >Cancel</button>
//                 <button className="confirm-button" onClick={handleConfirm}>Pay</button>
//               </div>
//             </>
//           )}
//           {showModal === 'voiceSettings' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Voice Settings</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="form-group">
//                   <label className="form-label">Voice Language</label>
//                   <select
//                     className="form-input"
//                     name="language"
//                     value={voiceSettings.language}
//                     onChange={handleVoiceSettingsChange}
//                   >
//                     <option value="en-US">English (US)</option>
//                     <option value="en-GB">English (UK)</option>
//                     <option value="hi-IN">Hindi (India)</option>
//                     <option value="es-ES">Spanish (Spain)</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Pitch ({voiceSettings.pitch})</label>
//                   <input
//                     className="form-input"
//                     type="range"
//                     name="pitch"
//                     min="0.5"
//                     max="2"
//                     step="0.1"
//                     value={voiceSettings.pitch}
//                     onChange={handleVoiceSettingsChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Rate ({voiceSettings.rate})</label>
//                   <input
//                     className="form-input"
//                     type="range"
//                     name="rate"
//                     min="0.5"
//                     max="2"
//                     step="0.1"
//                     value={voiceSettings.rate}
//                     onChange={handleVoiceSettingsChange}
//                   />
//                 </div>
//                 <button
//                   className="continue-button"
//                   onClick={() => {
//                     speak('Voice settings updated');
//                     closeModal();
//                   }}
//                 >
//                   Save
//                 </button>
//               </form>
//             </>
//           )}
//           {/* New modals for Recharges & Bills section */}
//           {showModal === 'dthRecharge' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">DTH Recharge</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="form-group">
//                   <label className="form-label">Subscriber ID / Customer ID</label>
//                   <input
//                     className="form-input"
//                     type="text"
//                     placeholder="Enter Subscriber ID"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Select Operator</label>
//                   <div className="operators-grid">
//                     {['Tata Play', 'Airtel Digital', 'Dish TV', 'Sun Direct'].map(op => (
//                       <div
//                         key={op}
//                         className="operator-item"
//                         onClick={() => {}}
//                       >
//                         <div className="operator-logo">{op[0]}</div>
//                         <div className="operator-name">{op}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Amount</label>
//                   <div className="amount-input-container">
//                     <span className="currency-symbol">₹</span>
//                     <input
//                       className="form-input amount-input"
//                       type="number"
//                       placeholder="Enter amount"
//                     />
//                   </div>
//                 </div>
//                 <button className="continue-button">
//                   Proceed to Pay
//                 </button>
//               </form>
//             </>
//           )}
//           {showModal === 'creditCardBill' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Credit Card Bill Payment</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="form-group">
//                   <label className="form-label">Select Card Issuer</label>
//                   <div className="operators-grid">
//                     {['HDFC Bank', 'SBI Card', 'ICICI Bank', 'Axis Bank'].map(bank => (
//                       <div
//                         key={bank}
//                         className="operator-item"
//                         onClick={() => {}}
//                       >
//                         <div className="operator-logo">{bank[0]}</div>
//                         <div className="operator-name">{bank}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Card Number</label>
//                   <input
//                     className="form-input"
//                     type="text"
//                     placeholder="Enter last 4 digits"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Amount</label>
//                   <div className="amount-input-container">
//                     <span className="currency-symbol">₹</span>
//                     <input
//                       className="form-input amount-input"
//                       type="number"
//                       placeholder="Enter amount"
//                     />
//                   </div>
//                 </div>
//                 <button className="continue-button">
//                   Proceed to Pay
//                 </button>
//               </form>
//             </>
//           )}
//           {showModal === 'rentPayment' && (
//             <>
//               <div className="modal-header">
//                 <div className="modal-title">Rent Payment</div>
//                 <X onClick={closeModal} className="pointers"/>
//               </div>
//               <form className="modal-form">
//                 <div className="form-group">
//                   <label className="form-label">Property Address</label>
//                   <textarea
//                     className="form-input textarea"
//                     placeholder="Enter your property address"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Landlord's UPI ID</label>
//                   <input
//                     className="form-input"
//                     type="text"
//                     placeholder="example@upi"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Amount</label>
//                   <div className="amount-input-container">
//                     <span className="currency-symbol">₹</span>
//                     <input
//                       className="form-input amount-input"
//                       type="number"
//                       placeholder="Enter amount"
//                     />
//                   </div>
//                 </div>
//                 <div className="rent-payment-note">
//                   <Info size={16} />
//                   <span>Rent payments may be eligible for tax benefits. Save your receipt for tax filing.</span>
//                 </div>
//                 <button className="continue-button">
//                   Proceed to Pay
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderNotificationsPanel = () => (
//     <div className="modal-overlay">
//       <div className="notifications-panel">
//         <div className="notifications-header">
//           <div className="notifications-title">Notifications</div>
//           <X onClick={() => setShowNotifications(false)} />
//         </div>
//         <div className="notifications-list">
//           {[
//             { title: 'Payment Received', desc: '₹500 from John Doe', time: '10:30 AM', unread: true },
//             { title: 'Recharge Successful', desc: '₹239 for Airtel', time: 'Yesterday', unread: false }
//           ].map((notif, i) => (
//             <div key={i} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
//               <div className="notification-title">{notif.title}</div>
//               <div className="notification-desc">{notif.desc}</div>
//               <div className="notification-time">{notif.time}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   // History Screen
//   const renderHistoryScreen = () => (
//     <div className="page-container">
//       <div className="page-title">Transaction History</div>
//       <div className="transactions-list">
//         {transactions.map(tx => (
//           <div key={tx.id} className="transaction-item">
//             <div className="transaction-left">
//               <div className={`transaction-icon ${tx.type}`}>
//                 {tx.type === 'payment' && <Send />}
//                 {tx.type === 'received' && <CheckCircle />}
//                 {tx.type === 'mobile' && <Smartphone />}
//                 {tx.type === 'bill' && <Lightbulb />}
//               </div>
//               <div className="transaction-details">
//                 <div className="transaction-name">{tx.name}</div>
//                 <div className="transaction-time">{tx.time}</div>
//               </div>
//             </div>
//             <div className={`transaction-amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
//               {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount)}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // Profile Screen
//   const renderProfileScreen = () => (
//     <div className="page-container">
//       <div className="profile-header">
//         <div className="profile-avatar">U</div>
//         <div className="profile-name">User</div>
//         <div className="profile-phone">+91 98765 43210</div>
//       </div>

//       <div className="profile-sections">
//         <div className="profile-section">
//           <div className="section-header">Account</div>
//           <div className="profile-option">
//             <User className="option-icon" />
//             <div className="option-text">Profile Information</div>
//             <ChevronRight className="option-arrow" />
//           </div>
//           <div className="profile-option">
//             <CreditCard className="option-icon" />
//             <div className="option-text">Saved Cards</div>
//             <ChevronRight className="option-arrow" />
//           </div>
//         </div>

//         <div className="profile-section">
//           <div className="section-header">Security</div>
//           <div className="profile-option">
//             <Settings className="option-icon" />
//             <div className="option-text">Change PIN</div>
//             <ChevronRight className="option-arrow" />
//           </div>
//           <div className="profile-option">
//             <Settings className="option-icon" />
//             <div className="option-text">Face Authentication</div>
//             <ChevronRight className="option-arrow" />
//           </div>
//         </div>

//         <div className="profile-section">
//           <div className="section-header">App Settings</div>
//           <div className="profile-option" onClick={handleVoiceSettings}>
//             <Volume2 className="option-icon" />
//             <div className="option-text">Voice Settings</div>
//             <ChevronRight className="option-arrow" />
//           </div>
//           <div className="profile-option">
//             <Settings className="option-icon" />
//             <div className="option-text">Notification Settings</div>
//             <ChevronRight className="option-arrow" />
//           </div>
//         </div>

//         <div className="profile-section">
//           <div className="logout-button" onClick={handleLogout}>
//             <LogOut className="logout-icon" />
//             <div className="logout-text">Logout</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="phonepe-app">
//       {isLoggedIn ? (
//         <>
//           <div className="app-header">
//             <div className="header-left">
//               <div className="app-title">PhonePe</div>
//             </div>
//             <div className="header-right">
//               <Bell className="header-icon" onClick={() => setShowNotifications(true)} />
//               {isVoiceEnabled ? (
//                 <Volume2 className="header-icon" onClick={handleVoiceSettings} />
//               ) : (
//                 <VolumeX className="header-icon" onClick={handleVoiceToggle} />
//               )}
//               <LogOut className="header-icon" onClick={handleLogout} />
//             </div>
//           </div>
//           <div className="main-content">
//             {currentScreen === 'home' && renderHomeScreen()}
//             {currentScreen === 'history' && renderHistoryScreen()}
//             {currentScreen === 'profile' && renderProfileScreen()}
//             {isScanning && renderScannerOverlay()}
//           </div>
//           <div className="bottom-nav">
//             {[
//               { icon: Home, text: 'Home', screen: 'home' },
//               { icon: Store, text: 'Stores', screen: 'stores' },
//               { icon: Gift, text: 'Rewards', screen: 'rewards' },
//               { icon: History, text: 'History', screen: 'history' },
//               { icon: User, text: 'Profile', screen: 'profile' }
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className={`nav-item ${currentScreen === item.screen ? 'active' : ''}`}
//                 onClick={() => handleNavClick(item.screen)}
//               >
//                 <item.icon className="nav-icon" />
//                 <div className="nav-text">{item.text}</div>
//               </div>
//             ))}
//           </div>
//           {renderModal()}
//           {showNotifications && renderNotificationsPanel()}
//         </>
//       ) : (
//         renderLoginScreen()
//       )}


//     </div>
//   );
// };

// export default PhonePeReplica;



import React, { useState, useEffect, useRef } from 'react';
import { Camera, User, QrCode, Bell, Home, Store, History, Info, X, Send, Smartphone, Lightbulb, CheckCircle, ChevronRight, Volume2, VolumeX, Building, Users, Search, LogOut, Gift, Tv, Zap, FileText, Clock, Settings, AlertCircle, CreditCard } from 'lucide-react';
import './PhonePe.css'
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
  const [searchContact, setSearchContact] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');

  // New states for face recognition
  const [isFaceRegistered, setIsFaceRegistered] = useState(() => {
    try {
      return localStorage.getItem('isFaceRegistered') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState(0);
  const [faceAuthError, setFaceAuthError] = useState(null);
  const [faceMatchConfidence, setFaceMatchConfidence] = useState(0);
  const [showFaceAuthError, setShowFaceAuthError] = useState(false);
  const [registeredFaceDescriptor, setRegisteredFaceDescriptor] = useState(() => {
    try {
      const saved = localStorage.getItem('registeredFaceDescriptor');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

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

  // Mock contact list
  const contacts = [
    { id: 1, name: 'John Doe', number: '9876543210', upiId: 'john@phonepe' },
    { id: 2, name: 'Alice Smith', number: '8765432109', upiId: 'alice@phonepe' },
    { id: 3, name: 'Bob Johnson', number: '7654321098', upiId: 'bob@phonepe' },
    { id: 4, name: 'Emma Brown', number: '6543210987', upiId: 'emma@phonepe' },
    { id: 5, name: 'Mike Wilson', number: '5432109876', upiId: 'mike@phonepe' }
  ];

  // Filtered contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchContact.toLowerCase()) ||
    contact.number.includes(searchContact)
  );

  // Persist face descriptor and registration status
  useEffect(() => {
    try {
      if (registeredFaceDescriptor) {
        localStorage.setItem('registeredFaceDescriptor', JSON.stringify(registeredFaceDescriptor));
      }
      localStorage.setItem('isFaceRegistered', isFaceRegistered);
    } catch (e) {
      console.warn('Unable to save face data to localStorage:', e);
    }
  }, [registeredFaceDescriptor, isFaceRegistered]);

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

  // Fallback face detection when face-api.js is not available
  const detectFace = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Create a grid of sample points across the face area
      const faceFeatures = [];
      const gridSize = 5; // 5x5 grid for more detailed face feature capture

      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const sampleRegionSize = Math.min(canvas.width, canvas.height) * 0.6; // 60% of smaller dimension
      const startX = centerX - sampleRegionSize / 2;
      const startY = centerY - sampleRegionSize / 2;

      // Sample points in a grid pattern across the face
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const sampleX = startX + (x * sampleRegionSize / gridSize);
          const sampleY = startY + (y * sampleRegionSize / gridSize);
          const sampleSize = Math.floor(sampleRegionSize / (gridSize * 2));

          try {
            // Get color data from this sample point
            const imageData = context.getImageData(
              sampleX,
              sampleY,
              sampleSize,
              sampleSize
            );

            // Calculate average RGB for this sample area
            const data = imageData.data;
            const avgRed = Array.from(data).filter((_, i) => i % 4 === 0).reduce((sum, val) => sum + val, 0) / (sampleSize * sampleSize);
            const avgGreen = Array.from(data).filter((_, i) => i % 4 === 1).reduce((sum, val) => sum + val, 0) / (sampleSize * sampleSize);
            const avgBlue = Array.from(data).filter((_, i) => i % 4 === 2).reduce((sum, val) => sum + val, 0) / (sampleSize * sampleSize);

            // Calculate brightness and contrast for this area
            const brightness = (avgRed + avgGreen + avgBlue) / 3;

            // Calculate a rudimentary "texture" value based on color variance
            let variance = 0;
            for (let i = 0; i < data.length; i += 4) {
              const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
              variance += Math.abs(pixelBrightness - brightness);
            }
            variance /= (sampleSize * sampleSize);

            // Store feature data for this sample point
            faceFeatures.push({
              x, y,
              avgRed,
              avgGreen,
              avgBlue,
              brightness,
              variance
            });
          } catch (e) {
            console.error("Error sampling face region:", e);
          }
        }
      }

      // Create an overall facial signature with additional metadata
      return {
        features: faceFeatures,
        timestamp: new Date().getTime(),
        frameWidth: canvas.width,
        frameHeight: canvas.height,
        lightingEstimate: faceFeatures.reduce((sum, f) => sum + f.brightness, 0) / faceFeatures.length,
        textureMap: faceFeatures.map(f => f.variance)
      };
    }
    return null;
  };

  // Compare face signatures to determine match score
  const compareFaceSignatures = (currentFace, registeredFace) => {
    // If either face is missing features, return 0 match
    if (!currentFace?.features || !registeredFace?.features) {
      return 0;
    }

    // Check if both faces have the same number of features
    if (currentFace.features.length !== registeredFace.features.length) {
      return 0;
    }

    // Calculate match score across all facial feature points
    let totalScore = 0;
    let matchCount = 0;

    // For each feature point in the grid
    for (let i = 0; i < currentFace.features.length; i++) {
      const currentFeature = currentFace.features[i];
      const registeredFeature = registeredFace.features[i];

      // Verify that we're comparing the same grid position
      if (currentFeature.x === registeredFeature.x && currentFeature.y === registeredFeature.y) {
        // Calculate color difference (lower is better)
        const redDiff = Math.abs(currentFeature.avgRed - registeredFeature.avgRed) / 255;
        const greenDiff = Math.abs(currentFeature.avgGreen - registeredFeature.avgGreen) / 255;
        const blueDiff = Math.abs(currentFeature.avgBlue - registeredFeature.avgBlue) / 255;

        // Calculate brightness and texture differences
        const brightnessDiff = Math.abs(currentFeature.brightness - registeredFeature.brightness) / 255;
        const textureDiff = Math.abs(currentFeature.variance - registeredFeature.variance) / 100;

        // Calculate average difference for this feature point (0-1 range, lower is better)
        const weightedDiff = (
          (redDiff * 0.2) +
          (greenDiff * 0.2) +
          (blueDiff * 0.2) +
          (brightnessDiff * 0.2) +
          (textureDiff * 0.2)
        );

        // Convert to a similarity score for this feature (0-100 range, higher is better)
        const featureScore = Math.max(0, 100 - (weightedDiff * 100));

        // This feature is significant if score is above 40
        if (featureScore > 40) {
          totalScore += featureScore;
          matchCount++;
        }
      }
    }

    // Calculate overall match percentage
    // Require at least 50% of features to match
    if (matchCount < currentFace.features.length * 0.5) {
      return 0; // Not enough matching features
    }

    // Return average score of matching features
    return totalScore / matchCount;
  };

  // Face Registration
  const handleFaceRegistration = () => {
    setIsRegistering(true);
    setRegistrationProgress(0);

    // Check permissions first
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' })
        .then(permissionStatus => {
          if (permissionStatus.state === 'denied') {
            openCameraPermissionHelp();
            setIsRegistering(false);
            return;
          } else {
            proceedWithFaceRegistration();
          }
        })
        .catch(error => {
          console.error('Permission query error:', error);
          proceedWithFaceRegistration();
        });
    } else {
      proceedWithFaceRegistration();
    }
  };

  const proceedWithFaceRegistration = () => {
    setIsRegistering(true);
    setRegistrationProgress(0);

    startCamera('user')
      .then(success => {
        if (success) {
          let progress = 0;
          let faceDescriptors = [];

          const interval = setInterval(() => {
            progress += 5;
            setRegistrationProgress(progress);

            // Capture face data every 20% of progress
            if (progress % 20 === 0) {
              const faceData = detectFace();
              if (faceData) {
                faceDescriptors.push(faceData);
              }
            }

            if (progress >= 100) {
              clearInterval(interval);

              // Check if we have enough face samples
              if (faceDescriptors.length >= 2) {
                // Use the last sample as the registered face
                const finalDescriptor = faceDescriptors[faceDescriptors.length - 1];
                setRegisteredFaceDescriptor(finalDescriptor);
                setIsFaceRegistered(true);
                speak('Face registration successful');
              } else {
                speak('Face registration failed. Please try again in good lighting.');
                setFaceAuthError("Couldn't detect a face clearly. Please try again.");
                setShowFaceAuthError(true);
                setTimeout(() => setShowFaceAuthError(false), 3000);
              }

              setIsRegistering(false);
              stopCamera();
              setRegistrationProgress(0);
            }
          }, 200);
        } else {
          setIsRegistering(false);
        }
      })
      .catch(error => {
        setIsRegistering(false);
        console.error("Camera access failed:", error);
      });
  };

  // Face Authentication
  const handleFaceScan = () => {
    // If face is not registered, show error
    if (!isFaceRegistered) {
      setFaceAuthError("No registered face found. Please register your face first.");
      setShowFaceAuthError(true);
      speak("No registered face found. Please register your face first.");
      setTimeout(() => setShowFaceAuthError(false), 3000);
      return;
    }

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
    if (!registeredFaceDescriptor) {
      setFaceAuthError("No registered face found. Please register your face first.");
      setShowFaceAuthError(true);
      setTimeout(() => setShowFaceAuthError(false), 3000);
      return;
    }

    setIsFaceScanning(true);
    setFaceMatchConfidence(0);

    // Directly request camera access through browser
    startCamera('user')
      .then(success => {
        if (success) {
          let progress = 0;
          let bestMatchScore = 0;
          let consistentMatches = 0;
          let consistentNonMatches = 0;
          let faceDetectionCount = 0;
          let noFaceCount = 0;

          const interval = setInterval(() => {
            progress += 10;
            setFaceScanProgress(progress);

            // Perform face matching every 20% of progress
            if (progress % 20 === 0) {
              // Detect face using our detection method
              const currentFaceData = detectFace();

              if (currentFaceData && currentFaceData.features && currentFaceData.features.length > 0) {
                faceDetectionCount++;
                noFaceCount = 0;

                // Compare with registered face descriptor
                const matchScore = compareFaceSignatures(
                  currentFaceData,
                  registeredFaceDescriptor
                );

                // Update UI
                setFaceMatchConfidence(matchScore);

                // Track consecutive matches and non-matches
                if (matchScore >= 85) {
                  // Strong match - likely the registered person
                  consistentMatches++;
                  consistentNonMatches = 0;
                  bestMatchScore = Math.max(bestMatchScore, matchScore);
                } else if (matchScore <= 60) {
                  // Clear non-match - definitely not the registered person
                  consistentNonMatches++;
                  consistentMatches = 0;
                } else {
                  // Ambiguous result - reset counters
                  consistentMatches = 0;
                  consistentNonMatches = 0;
                }

                // Early rejection - different person detected
                if (consistentNonMatches >= 2) {
                  clearInterval(interval);
                  setIsFaceScanning(false);
                  setFaceAuthError("Unrecognized face detected. Only the registered user can log in.");
                  setShowFaceAuthError(true);
                  speak("Authentication failed. Unrecognized face.");
                  setTimeout(() => setShowFaceAuthError(false), 3000);
                  setFaceScanProgress(0);
                  stopCamera();
                  return;
                }

                // Early success - registered person confirmed
                if (consistentMatches >= 2 && bestMatchScore > 90) {
                  clearInterval(interval);
                  setIsFaceScanning(false);
                  setIsLoggedIn(true);
                  speak('Face authentication successful');
                  setFaceScanProgress(0);
                  stopCamera();
                  return;
                }
              } else {
                noFaceCount++;

                // If no face is detected in multiple consecutive frames, alert the user
                if (noFaceCount >= 3) {
                  clearInterval(interval);
                  setIsFaceScanning(false);
                  setFaceAuthError("No face detected. Please ensure your face is visible.");
                  setShowFaceAuthError(true);
                  speak("No face detected");
                  setTimeout(() => setShowFaceAuthError(false), 3000);
                  setFaceScanProgress(0);
                  stopCamera();
                  return;
                }
              }
            }

            if (progress >= 100) {
              clearInterval(interval);
              setIsFaceScanning(false);

              // Final decision based on accumulated evidence
              if (consistentMatches >= 1 && bestMatchScore > 85) {
                setIsLoggedIn(true);
                speak('Face authentication successful');
              } else if (faceDetectionCount === 0) {
                setFaceAuthError("No face detected. Please ensure your face is visible.");
                setShowFaceAuthError(true);
                speak("No face detected");
              } else if (bestMatchScore < 70) {
                setFaceAuthError("Unrecognized face. Only the registered user can log in.");
                setShowFaceAuthError(true);
                speak("Authentication failed. Unrecognized face.");
              } else {
                setFaceAuthError("Face verification failed. Please try again with better lighting.");
                setShowFaceAuthError(true);
                speak("Face authentication failed");
              }

              setTimeout(() => setShowFaceAuthError(false), 3000);
              setFaceScanProgress(0);
              stopCamera();
            }
          }, 300);
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
  // Check if the gesture contains all the points required for L shape
  const hasPoint0 = gesturePath.includes(0);
  const hasPoint3 = gesturePath.includes(3);
  const hasPoint6 = gesturePath.includes(6);
  const hasPoint7 = gesturePath.includes(7);
  
  // Check if they appear in the correct sequence
  let isCorrectSequence = false;
  
  if (hasPoint0 && hasPoint3 && hasPoint6 && hasPoint7) {
    const index0 = gesturePath.indexOf(0);
    const index3 = gesturePath.indexOf(3);
    const index6 = gesturePath.indexOf(6);
    const index7 = gesturePath.indexOf(7);
    
    // Check if they appear in the correct order: 0 → 3 → 6 → 7
    if (index0 < index3 && index3 < index6 && index6 < index7) {
      isCorrectSequence = true;
    }
  }
  
  // Only authenticate if the L-shape was drawn correctly
  if (isCorrectSequence) {
    console.log('L-shape pattern detected: Login successful');
    setIsLoggedIn(true);
    setGesturePath([]);
    speak('Login successful');
  } else {
    console.log('Invalid gesture pattern');
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
    const container = gestureContainerRef.current;
    if (!container) return;

    const touchStartHandler = (e) => {
      e.preventDefault();
      setGesturePath([]);
      const rect = container.getBoundingClientRect();
      const point = getGesturePoint(e, rect);
      setGesturePath([point]);
    };

    const touchMoveHandler = (e) => {
      e.preventDefault();
      if (gesturePath.length > 0) {
        const rect = container.getBoundingClientRect();
        const point = getGesturePoint(e, rect);

        // Check if the last point is different from the new point
        // to avoid adding the same point multiple times
        if (gesturePath[gesturePath.length - 1] !== point) {
          setGesturePath(prev => [...prev, point]);
        }
      }
    };

    const touchEndHandler = () => {
      handleGestureEnd();
    };

    container.addEventListener('touchstart', touchStartHandler, { passive: false });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler);

    return () => {
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
    };
  }, [gesturePath]);
  useEffect(() => {
    if (gesturePath.length > 0 && gestureSvgRef.current) {
      // Get the SVG element dimensions
      const svgWidth = gestureSvgRef.current.clientWidth || 300;
      const svgHeight = gestureSvgRef.current.clientHeight || 300;

      // Calculate points as numerical values instead of percentages
      const points = gesturePath.map(p => {
        const row = Math.floor(p / 3);
        const col = p % 3;

        // Convert from percentage to actual pixel coordinates
        const x = Math.round((col + 0.5) * svgWidth / 3);
        const y = Math.round((row + 0.5) * svgHeight / 3);

        return `${x},${y}`;
      }).join(' ');

      gestureSvgRef.current.innerHTML = `<polyline points="${points}" stroke="#5f259f" stroke-width="5" fill="none"/>`;
    } else if (gestureSvgRef.current) {
      gestureSvgRef.current.innerHTML = '';
    }
  }, [gesturePath]);
  // Scanner Handling
  const handleScan = () => {
    setIsScanning(true);

    setTimeout(() => {
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
    }, 500); // Added a slight delay to ensure UI is rendered before camera initialization
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

  // Handle face registration reset
  const handleResetFaceRegistration = () => {
    setIsFaceRegistered(false);
    setRegisteredFaceDescriptor(null);
    try {
      localStorage.removeItem('registeredFaceDescriptor');
      localStorage.removeItem('isFaceRegistered');
    } catch (e) {
      console.warn('Unable to remove face data from localStorage:', e);
    }
    speak('Face registration reset. You will need to register again.');
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
    setSearchContact('');
    setSelectedContact(null);
    setAccountNumber('');
    setIfscCode('');
    setBankName('');
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
    if (showModal === 'sendToUPI') {
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
    } else if (showModal === 'sendToContact') {
      if (amount && selectedContact) {
        const newTransaction = {
          id: transactions.length + 1,
          name: `Sent to ${selectedContact.name}`,
          time: new Date().toLocaleTimeString(),
          amount: -parseInt(amount),
          type: 'payment'
        };
        setTransactions([newTransaction, ...transactions]);
        setBalance(balance - parseInt(amount));
        closeModal();
        speak(`Sent ${amount} rupees to ${selectedContact.name}`);
      }
    } else if (showModal === 'sendToBank') {
      if (amount && accountNumber && ifscCode && bankName) {
        const newTransaction = {
          id: transactions.length + 1,
          name: `Bank Transfer to ${bankName}`,
          time: new Date().toLocaleTimeString(),
          amount: -parseInt(amount),
          type: 'payment'
        };
        setTransactions([newTransaction, ...transactions]);
        setBalance(balance - parseInt(amount));
        closeModal();
        speak(`Sent ${amount} rupees to bank account`);
      }
    } else if (showModal === 'sendToSelf') {
      if (amount) {
        const newTransaction = {
          id: transactions.length + 1,
          name: `Self Transfer`,
          time: new Date().toLocaleTimeString(),
          amount: -parseInt(amount),
          type: 'payment'
        };
        setTransactions([newTransaction, ...transactions]);
        // No need to deduct from balance since it's self-transfer
        closeModal();
        speak(`Self transfer of ${amount} rupees initiated`);
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

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setPin('');
    setGesturePath([]);
    setCurrentScreen('home');
    setShowNotifications(false);
    speak('Logged out successfully');
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
  useEffect(() => {
    const container = gestureContainerRef.current;
    if (!container) return;

    // Custom event handlers for touch events
    const touchStartHandler = (e) => {
      e.preventDefault();
      setGesturePath([]);
      const rect = container.getBoundingClientRect();
      const point = getGesturePoint(e, rect);
      setGesturePath([point]);
    };

    const touchMoveHandler = (e) => {
      e.preventDefault();
      if (gesturePath.length > 0) {
        const rect = container.getBoundingClientRect();
        const point = getGesturePoint(e, rect);
        setGesturePath([...gesturePath, point]);
      }
    };

    const touchEndHandler = (e) => {
      // Using the modified handleGestureEnd function for L-shape verification
      handleGestureEnd();
    };

    // Add event listeners with {passive: false} to allow preventDefault()
    container.addEventListener('touchstart', touchStartHandler, { passive: false });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler);

    // Cleanup
    return () => {
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
    };
  }, [gesturePath]);
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
            <li>Face: You must register your face first, then use it to log in</li>
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
          {isFaceRegistered ? (
            // Show login UI if face is registered
            <div className="face-scanner">
              {isFaceScanning ? (
                <div className="face-scan-animation">
                  <video ref={videoRef} className="face-video" autoPlay playsInline />
                  <div className="face-scan-line"></div>
                  <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                  {faceMatchConfidence > 0 && (
                    <div className="face-match-confidence">
                      Match: {Math.round(faceMatchConfidence)}%
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Camera className="face-camera-icon" size={40} />
                  <button className="face-auth-button" onClick={handleFaceScan}>Start Face Scan</button>
                </>
              )}
            </div>
          ) : (
            // Show registration UI if face is not registered
            <div className="face-scanner">
              {isRegistering ? (
                <div className="face-scan-animation">
                  <video ref={videoRef} className="face-video" autoPlay playsInline />
                  <div className="face-scan-line"></div>
                  <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                  <div className="registration-message">
                    Registering face... Please look directly at the camera
                  </div>
                </div>
              ) : (
                <>
                  <Camera className="face-camera-icon" size={40} />
                  <div className="face-registration-message">
                    No face registered. You need to register your face first.
                  </div>
                  <button className="face-auth-button" onClick={handleFaceRegistration}>Register Face</button>
                </>
              )}
            </div>
          )}

          {(isFaceScanning || isRegistering) && (
            <div className="face-auth-progress">
              <div
                className="face-auth-progress-bar"
                style={{ width: `${isFaceScanning ? faceScanProgress : registrationProgress}%` }}
              ></div>
            </div>
          )}

          {isFaceRegistered && !isFaceScanning && (
            <div className="face-reset-container">
              <button className="face-reset-button" onClick={handleResetFaceRegistration}>
                Reset Face Registration
              </button>
            </div>
          )}

          {showFaceAuthError && (
            <div className="face-auth-error">
              <AlertCircle size={16} />
              <span>{faceAuthError}</span>
            </div>
          )}

          <div className="face-auth-text">
            {isFaceScanning ? "Position your face within the frame" :
              isRegistering ? "Keep your face centered while we register it" :
                isFaceRegistered ? "Ready for face authentication" :
                  "Register your face for secure login"}
          </div>

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
          // Touch events are now handled by the useEffect
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
        <div className="user-greeting">Hello, Kavana</div>
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
          { icon: Send, text: 'Send Money', action: () => openModal('sendToUPI') },
          { icon: Smartphone, text: 'Mobile Recharge', action: () => openModal('mobileRecharge') },
          { icon: QrCode, text: 'Scan & Pay', action: handleScan },
          { icon: Lightbulb, text: 'Electricity', action: () => openModal('billPayment') }
        ].map((item, i) => (
          <div key={i} className="action-item" onClick={() => { item.action(); speak(item.text); }}>
            <div className="action-icon"><item.icon /></div>
            <div className="action-text">{item.text}</div>
          </div>
        ))}
      </div>
      <div className="section-container">
        <div className="section-title">Recharges & Bills</div>
        <div className="transfers-grid">
          {[
            { icon: Tv, text: 'DTH', action: () => openModal('dthRecharge') },
            { icon: Zap, text: 'Electricity', action: () => openModal('billPayment') },
            { icon: FileText, text: 'Credit Card', action: () => openModal('creditCardBill') },
            { icon: Clock, text: 'Rent Payment', action: () => openModal('rentPayment') }
          ].map((item, i) => (
            <div key={i} className="transfer-item" onClick={() => { item.action(); speak(item.text); }}>
              <div className="transfer-icon"><item.icon /></div>
              <div className="transfer-text">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="section-container">
        <div className="section-title">Transfer Money</div>
        <div className="transfers-grid">
          {[
            { icon: User, text: 'To Contact', action: () => openModal('sendToContact') },
            { icon: Building, text: 'To Bank', action: () => openModal('sendToBank') },
            { icon: Users, text: 'To Self', action: () => openModal('sendToSelf') },
            { icon: QrCode, text: 'UPI ID', action: () => openModal('sendToUPI') }
          ].map((item, i) => (
            <div key={i} className="transfer-item" onClick={() => { item.action(); speak(item.text); }}>
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
                <X onClick={closeModal} className="pointers" />
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
          {showModal === 'sendToUPI' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Send Money to UPI ID</div>
                <X onClick={closeModal} className="pointers" />
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
          {showModal === 'sendToContact' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Send Money to Contact</div>
                <X onClick={closeModal} className="pointers" />
              </div>
              <form className="modal-form">
                <div className="form-group">
                  <label className="form-label">Search Contact</label>
                  <div className="search-input-container">
                    <Search className="search-icon" size={16} />
                    <input
                      className="form-input search-input"
                      type="text"
                      value={searchContact}
                      onChange={(e) => setSearchContact(e.target.value)}
                      placeholder="Name or phone number"
                    />
                  </div>
                </div>
                <div className="contacts-list">
                  {filteredContacts.map(contact => (
                    <div
                      key={contact.id}
                      className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="contact-avatar">{contact.name.charAt(0)}</div>
                      <div className="contact-info">
                        <div className="contact-name">{contact.name}</div>
                        <div className="contact-number">{contact.number}</div>
                      </div>
                      {selectedContact?.id === contact.id && (
                        <CheckCircle className="selected-icon" size={16} />
                      )}
                    </div>
                  ))}
                  {searchContact && filteredContacts.length === 0 && (
                    <div className="no-contacts">No contacts found</div>
                  )}
                </div>
                {selectedContact && (
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
                )}
                <div className="form-buttons">
                  <button className="cancel-button" onClick={closeModal}>Cancel</button>
                  <button
                    className={`confirm-button ${!amount || !selectedContact ? 'disabled' : ''}`}
                    onClick={handleConfirm}
                    disabled={!amount || !selectedContact}
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </>
          )}
          {showModal === 'sendToBank' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Send Money to Bank Account</div>
                <X onClick={closeModal} className="pointers" />
              </div>
              <form className="modal-form">
                <div className="form-group">
                  <label className="form-label">Bank Name</label>
                  <input
                    className="form-input"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Account Number</label>
                  <input
                    className="form-input"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input
                    className="form-input"
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="Enter IFSC code"
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
                    className={`confirm-button ${!amount || !accountNumber || !ifscCode || !bankName ? 'disabled' : ''}`}
                    onClick={handleConfirm}
                    disabled={!amount || !accountNumber || !ifscCode || !bankName}
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </>
          )}
          {showModal === 'sendToSelf' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Transfer to Your Accounts</div>
                <X onClick={closeModal} className="pointers" />
              </div>
              <form className="modal-form">
                <div className="self-accounts-list">
                  <div className="self-account-item selected">
                    <div className="account-icon"><Building size={24} /></div>
                    <div className="account-info">
                      <div className="account-name">HDFC Bank</div>
                      <div className="account-number">XXXX4567</div>
                    </div>
                    <CheckCircle className="selected-icon" size={16} />
                  </div>
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
                <div className="self-transfer-note">
                  <Info size={16} />
                  <span>Money will be transferred to your selected account within 24 hours</span>
                </div>
                <div className="form-buttons">
                  <button className="cancel-button" onClick={closeModal}>Cancel</button>
                  <button
                    className={`confirm-button ${!amount ? 'disabled' : ''}`}
                    onClick={handleConfirm}
                    disabled={!amount}
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
                <X onClick={closeModal} className="pointers" />
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
                <X onClick={closeModal} className="pointers" />
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
                <X onClick={closeModal} className="pointers" />
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
                <X onClick={closeModal} className="pointers" />
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
                <X onClick={closeModal} className="pointers" />
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
                <X onClick={closeModal} className="pointers" />
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
                <button className="cancel-button" onClick={closeModal} >Cancel</button>
                <button className="confirm-button" onClick={handleConfirm}>Pay</button>
              </div>
            </>
          )}
          {showModal === 'voiceSettings' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Voice Settings</div>
                <X onClick={closeModal} className="pointers" />
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
          {/* New modals for Recharges & Bills section */}
          {showModal === 'dthRecharge' && (
            <>
              <div className="modal-header">
                <div className="modal-title">DTH Recharge</div>
                <X onClick={closeModal} className="pointers" />
              </div>
              <form className="modal-form">
                <div className="form-group">
                  <label className="form-label">Subscriber ID / Customer ID</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Enter Subscriber ID"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Select Operator</label>
                  <div className="operators-grid">
                    {['Tata Play', 'Airtel Digital', 'Dish TV', 'Sun Direct'].map(op => (
                      <div
                        key={op}
                        className="operator-item"
                        onClick={() => { }}
                      >
                        <div className="operator-logo">{op[0]}</div>
                        <div className="operator-name">{op}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <div className="amount-input-container">
                    <span className="currency-symbol">₹</span>
                    <input
                      className="form-input amount-input"
                      type="number"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <button className="continue-button">
                  Proceed to Pay
                </button>
              </form>
            </>
          )}
          {showModal === 'creditCardBill' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Credit Card Bill Payment</div>
                <X onClick={closeModal} className="pointers" />
              </div>
              <form className="modal-form">
                <div className="form-group">
                  <label className="form-label">Select Card Issuer</label>
                  <div className="operators-grid">
                    {['HDFC Bank', 'SBI Card', 'ICICI Bank', 'Axis Bank'].map(bank => (
                      <div
                        key={bank}
                        className="operator-item"
                        onClick={() => { }}
                      >
                        <div className="operator-logo">{bank[0]}</div>
                        <div className="operator-name">{bank}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Enter last 4 digits"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <div className="amount-input-container">
                    <span className="currency-symbol">₹</span>
                    <input
                      className="form-input amount-input"
                      type="number"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <button className="continue-button">
                  Proceed to Pay
                </button>
              </form>
            </>
          )}
          {showModal === 'rentPayment' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Rent Payment</div>
                <X onClick={closeModal} className="pointers" />
              </div>
              <form className="modal-form">
                <div className="form-group">
                  <label className="form-label">Property Address</label>
                  <textarea
                    className="form-input textarea"
                    placeholder="Enter your property address"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Landlord's UPI ID</label>
                  <input
                    className="form-input"
                    type="text"
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
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <div className="rent-payment-note">
                  <Info size={16} />
                  <span>Rent payments may be eligible for tax benefits. Save your receipt for tax filing.</span>
                </div>
                <button className="continue-button">
                  Proceed to Pay
                </button>
              </form>
            </>
          )}
          {showModal === 'cameraPermissionHelp' && (
            <>
              <div className="modal-header">
                <div className="modal-title">Camera Access Required</div>
                <X onClick={closeModal} className="pointers" />
              </div>
              <div className="permission-help-content">
                <div className="permission-help-icon">
                  <Camera size={40} />
                </div>
                <div className="permission-help-text">
                  <p>PhonePe needs access to your camera for face authentication and QR scanning.</p>
                  <p>Please follow these steps to enable camera access:</p>
                  <ol>
                    <li>Click on the lock/info icon in your browser's address bar</li>
                    <li>Find "Camera" in the site settings</li>
                    <li>Change the permission to "Allow"</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
                <button className="continue-button" onClick={closeModal}>
                  I Understand
                </button>
              </div>
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

  // History Screen
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

  // Profile Screen
  const renderProfileScreen = () => (
    <div className="page-container">
      <div className="profile-header">
        <div className="profile-avatar">U</div>
        <div className="profile-name">Kavana</div>
        <div className="profile-phone">+91 98765 43210</div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <div className="section-header">Account</div>
          <div className="profile-option">
            <User className="option-icon" />
            <div className="option-text">Profile Information</div>
            <ChevronRight className="option-arrow" />
          </div>
          <div className="profile-option">
            <CreditCard className="option-icon" />
            <div className="option-text">Saved Cards</div>
            <ChevronRight className="option-arrow" />
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">Security</div>
          <div className="profile-option">
            <Settings className="option-icon" />
            <div className="option-text">Change PIN</div>
            <ChevronRight className="option-arrow" />
          </div>
          <div className="profile-option" onClick={handleResetFaceRegistration}>
            <Camera className="option-icon" />
            <div className="option-text">Reset Face Registration</div>
            <ChevronRight className="option-arrow" />
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">App Settings</div>
          <div className="profile-option" onClick={handleVoiceSettings}>
            <Volume2 className="option-icon" />
            <div className="option-text">Voice Settings</div>
            <ChevronRight className="option-arrow" />
          </div>
          <div className="profile-option">
            <Settings className="option-icon" />
            <div className="option-text">Notification Settings</div>
            <ChevronRight className="option-arrow" />
          </div>
        </div>

        <div className="profile-section">
          <div className="logout-button" onClick={handleLogout}>
            <LogOut className="logout-icon" />
            <div className="logout-text">Logout</div>
          </div>
        </div>
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
              <LogOut className="header-icon" onClick={handleLogout} />
            </div>
          </div>
          <div className="main-content">
            {currentScreen === 'home' && renderHomeScreen()}
            {currentScreen === 'history' && renderHistoryScreen()}
            {currentScreen === 'profile' && renderProfileScreen()}
            {isScanning && renderScannerOverlay()}
          </div>
          <div className="bottom-nav">
            {[
              { icon: Home, text: 'Home', screen: 'home' },
              { icon: Store, text: 'Stores', screen: 'stores' },
              { icon: Gift, text: 'Rewards', screen: 'rewards' },
              { icon: History, text: 'History', screen: 'history' },
              { icon: User, text: 'Profile', screen: 'profile' }
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