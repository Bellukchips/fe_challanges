import { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { X, Camera, RotateCw, Hand, ChevronRight } from 'lucide-react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import Image from 'next/image';
interface WebcamDialogProps {
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    onCapture: (imageSrc: string) => void;
}

export default function WebcamDialog({ dialogRef, onCapture }: Readonly<WebcamDialogProps>) {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastGestureTimeRef = useRef<number>(0);
    const stableGestureCountRef = useRef<{ fingers: number; count: number }>({ fingers: 0, count: 0 });
    const invalidGestureCountRef = useRef<number>(0);

    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [isCapturing, setIsCapturing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [gestureSequence, setGestureSequence] = useState<number[]>([]);
    const [currentFingers, setCurrentFingers] = useState<number>(0);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isInvalidGesture, setIsInvalidGesture] = useState<boolean>(false);


    const STABLE_FRAMES_REQUIRED = 15;
    const MIN_GESTURE_INTERVAL = 1500;
    const INVALID_GESTURE_RESET_FRAMES = 20;


    useEffect(() => {
        const initializeHandLandmarker = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                        delegate: "GPU"
                    },
                    numHands: 1,
                    runningMode: "VIDEO",
                    minHandDetectionConfidence: 0.5,
                    minHandPresenceConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                handLandmarkerRef.current = handLandmarker;
                setIsModelLoading(false);
            } catch (error) {
                console.error("Error initializing hand landmarker:", error);
                setIsModelLoading(false);
            }
        };

        initializeHandLandmarker();

        return () => {
            if (handLandmarkerRef.current) {
                handLandmarkerRef.current.close();
            }
        };
    }, []);


    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleOpen = () => {
            setIsOpen(true);
            setGestureSequence([]);
            setCurrentFingers(0);
            lastGestureTimeRef.current = 0;
            stableGestureCountRef.current = { fingers: 0, count: 0 };
            invalidGestureCountRef.current = 0;
            setCapturedImage(null);
            setIsInvalidGesture(false);
        };

        const handleClose = () => {
            setIsOpen(false);
            setIsCapturing(false);
            setGestureSequence([]);
            setCurrentFingers(0);
            setCountdown(null);
            lastGestureTimeRef.current = 0;
            stableGestureCountRef.current = { fingers: 0, count: 0 };
            invalidGestureCountRef.current = 0;
            setCapturedImage(null);
            setIsInvalidGesture(false);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };

        dialog.addEventListener('close', handleClose);

        const observer = new MutationObserver(() => {
            if (dialog.open) {
                handleOpen();
            } else {
                handleClose();
            }
        });

        observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });

        return () => {
            dialog.removeEventListener('close', handleClose);
            observer.disconnect();
        };
    }, [dialogRef]);


    const countFingers = (landmarks: any): number => {
        if (!landmarks || landmarks.length === 0) return 0;

        const hand = landmarks[0];
        let count = 0;


        const palmBase = {
            x: (hand[0].x + hand[9].x) / 2,
            y: (hand[0].y + hand[9].y) / 2
        };


        const thumbTip = hand[4];
        const thumbMCP = hand[2];
        const thumbDistance = Math.sqrt(
            Math.pow(thumbTip.x - palmBase.x, 2) +
            Math.pow(thumbTip.y - palmBase.y, 2)
        );
        const thumbMCPDistance = Math.sqrt(
            Math.pow(thumbMCP.x - palmBase.x, 2) +
            Math.pow(thumbMCP.y - palmBase.y, 2)
        );
        if (thumbDistance > thumbMCPDistance * 1.2) count++;


        const indexTip = hand[8];
        const indexPIP = hand[6];
        const indexMCP = hand[5];
        if (indexTip.y < indexPIP.y - 0.03 && indexTip.y < indexMCP.y) count++;


        const middleTip = hand[12];
        const middlePIP = hand[10];
        const middleMCP = hand[9];
        if (middleTip.y < middlePIP.y - 0.03 && middleTip.y < middleMCP.y) count++;


        const ringTip = hand[16];
        const ringPIP = hand[14];
        const ringMCP = hand[13];
        if (ringTip.y < ringPIP.y - 0.03 && ringTip.y < ringMCP.y) count++;


        const pinkyTip = hand[20];
        const pinkyPIP = hand[18];
        const pinkyMCP = hand[17];
        if (pinkyTip.y < pinkyPIP.y - 0.03 && pinkyTip.y < pinkyMCP.y) count++;

        return count;
    };


    const detectHands = useCallback(async () => {
        if (!isOpen || !webcamRef.current || !handLandmarkerRef.current || isCapturing) {
            return;
        }

        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) {
            animationFrameRef.current = requestAnimationFrame(detectHands);
            return;
        }

        const startTimeMs = performance.now();
        const results: HandLandmarkerResult = handLandmarkerRef.current.detectForVideo(video, startTimeMs);


        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (results.landmarks && results.landmarks.length > 0) {
                    const landmarks = results.landmarks[0];


                    ctx.strokeStyle = '#00FF00';
                    ctx.lineWidth = 2;


                    landmarks.forEach((landmark: any) => {
                        ctx.beginPath();
                        ctx.arc(
                            landmark.x * canvas.width,
                            landmark.y * canvas.height,
                            5,
                            0,
                            2 * Math.PI
                        );
                        ctx.fillStyle = '#FF0000';
                        ctx.fill();
                    });
                }
            }
        }


        if (results.landmarks && results.landmarks.length > 0) {
            const fingers = countFingers(results.landmarks);


            setCurrentFingers(fingers);


            const isValidGesture = fingers >= 1 && fingers <= 3;


            if (!isValidGesture) {
                invalidGestureCountRef.current++;
                setIsInvalidGesture(true);


                if (invalidGestureCountRef.current >= INVALID_GESTURE_RESET_FRAMES) {
                    setGestureSequence([]);
                    stableGestureCountRef.current = { fingers: 0, count: 0 };
                }


                animationFrameRef.current = requestAnimationFrame(detectHands);
                return;
            }


            invalidGestureCountRef.current = 0;
            setIsInvalidGesture(false);


            if (stableGestureCountRef.current.fingers === fingers) {
                stableGestureCountRef.current.count++;
            } else {
                stableGestureCountRef.current = { fingers, count: 1 };
            }


            if (stableGestureCountRef.current.count >= STABLE_FRAMES_REQUIRED) {
                const currentTime = Date.now();


                if (currentTime - lastGestureTimeRef.current >= MIN_GESTURE_INTERVAL) {

                    setGestureSequence(prev => {
                        const lastGesture = prev[prev.length - 1];


                        if (fingers !== lastGesture) {
                            const newSequence = [...prev];


                            if (newSequence.length === 0 && fingers === 1) {

                                newSequence.push(1);
                                lastGestureTimeRef.current = currentTime;
                            } else if (newSequence.length === 1 && newSequence[0] === 1 && fingers === 2) {

                                newSequence.push(2);
                                lastGestureTimeRef.current = currentTime;
                            } else if (newSequence.length === 2 &&
                                newSequence[0] === 1 &&
                                newSequence[1] === 2 &&
                                fingers === 3) {

                                newSequence.push(3);
                                lastGestureTimeRef.current = currentTime;


                                let count = 3;
                                setCountdown(count);

                                const countdownInterval = setInterval(() => {
                                    count--;
                                    setCountdown(count);

                                    if (count === 0) {
                                        clearInterval(countdownInterval);
                                        capture();
                                    }
                                }, 1000);


                                stableGestureCountRef.current = { fingers: 0, count: 0 };
                                return [];
                            } else if (newSequence.length > 0) {

                                newSequence.length = 0;
                            }


                            stableGestureCountRef.current = { fingers: 0, count: 0 };
                            return newSequence;
                        }

                        return prev;
                    });
                }
            }
        } else {
            setCurrentFingers(0);
            setIsInvalidGesture(false);

            stableGestureCountRef.current = { fingers: 0, count: 0 };
            invalidGestureCountRef.current = 0;
        }

        animationFrameRef.current = requestAnimationFrame(detectHands);
    }, [isOpen, isCapturing]);


    useEffect(() => {
        if (isOpen && !isModelLoading && handLandmarkerRef.current && !capturedImage) {
            detectHands();
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isOpen, isModelLoading, detectHands, capturedImage]);

    const closeModal = () => {
        dialogRef.current?.close();
    };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setIsCapturing(true);
                setCapturedImage(imageSrc);
                setTimeout(() => {
                    setIsCapturing(false);
                    setGestureSequence([]);
                    setCurrentFingers(0);
                    setCountdown(null);
                }, 500);
            }
        }
    }, []);


    const retakePhoto = () => {
        setCapturedImage(null);
        setGestureSequence([]);
        setCurrentFingers(0);
        lastGestureTimeRef.current = 0;
        stableGestureCountRef.current = { fingers: 0, count: 0 };
        invalidGestureCountRef.current = 0;
        setIsInvalidGesture(false);
    };

    const submitPhoto = () => {
        if (capturedImage) {
            onCapture(capturedImage);
            closeModal();
        }
    };

    const switchCamera = () => {
        setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
        setGestureSequence([]);
        setCurrentFingers(0);
        lastGestureTimeRef.current = 0;
        stableGestureCountRef.current = { fingers: 0, count: 0 };
        invalidGestureCountRef.current = 0;
        setIsInvalidGesture(false);
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: facingMode
    };

    return (
        <dialog
            ref={dialogRef}
            onCancel={closeModal}
            className="backdrop:bg-black/50 bg-transparent p-0 max-w-5xl w-full max-h-[90vh] rounded-lg m-auto overflow-visible"
        >
            <div className="bg-white rounded-lg shadow-xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex flex-row justify-between items-start mb-4 sm:mb-6">
                    <div className="flex flex-col justify-start item-start">
                        <h2 className="text-lg sm:text-xl font-bold">
                            Raise Your Hand to Capture
                        </h2>
                        <span className="text-xs sm:text-sm text-gray-600 mt-1">
                            We’ll take the photo once your hand pose is detected.
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close modal"
                        className="cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#01959F]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                    {capturedImage ? (
                        <img
                            src={capturedImage}
                            alt="Captured"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <>
                            {isOpen && (
                                <>
                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={videoConstraints}
                                        className="w-full h-full object-cover"
                                        mirrored={facingMode === 'user'}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        width={1280}
                                        height={720}
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    />
                                </>
                            )}

                            {!isOpen && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-white text-sm">Loading camera...</p>
                                </div>
                            )}

                            {isModelLoading && isOpen && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="text-center text-white">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                                        <p className="text-sm">Loading hand detection model...</p>
                                    </div>
                                </div>
                            )}

                            {/* Gesture Status */}
                            {isOpen && !isModelLoading && (
                                <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Hand className="w-5 h-5" />
                                        <span className={`font-bold text-lg ${isInvalidGesture ? 'text-red-400' : ''}`}>
                                            {currentFingers} finger{currentFingers !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    {isInvalidGesture && (
                                        <div className="text-xs text-red-400 mb-2 animate-pulse">
                                            ⚠️ Invalid gesture! Show 1, 2, or 3 fingers only
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-300 mb-2">
                                        Sequence: {gestureSequence.length > 0 ? gestureSequence.join(' → ') : 'Waiting...'}
                                    </div>
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map((num) => (
                                            <div
                                                key={num}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${gestureSequence.includes(num)
                                                    ? 'bg-green-500 border-green-300 text-white scale-110'
                                                    : gestureSequence.length === num - 1
                                                        ? 'bg-yellow-500 border-yellow-300 text-white animate-pulse'
                                                        : 'bg-gray-700 border-gray-600 text-gray-400'
                                                    }`}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-300 mt-2">
                                        {gestureSequence.length === 0 && '👉 Show 1 finger'}
                                        {gestureSequence.length === 1 && '✌️ Show 2 fingers'}
                                        {gestureSequence.length === 2 && '🤟 Show 3 fingers'}
                                    </div>
                                </div>
                            )}

                            {countdown !== null && countdown > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="text-white text-9xl font-bold animate-pulse">
                                        {countdown}
                                    </div>
                                </div>
                            )}

                            {isOpen && (
                                <button
                                    type="button"
                                    onClick={switchCamera}
                                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#01959F]"
                                    aria-label="Switch camera"
                                >
                                    <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                </button>
                            )}

                            {isCapturing && (
                                <div className="absolute inset-0 bg-white animate-pulse"></div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    {capturedImage ? (
                        <>
                            <button
                                type="button"
                                onClick={retakePhoto}
                                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center justify-center gap-2"
                            >
                                <RotateCw className="w-5 h-5" />
                                Retake Photo
                            </button>
                            <button
                                type="button"
                                onClick={submitPhoto}
                                className="w-full sm:w-auto bg-[#01959F] hover:bg-[#08727a] text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#01959F] focus:ring-offset-2 flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                Submit Photo
                            </button>
                        </>
                    ) : (
                        <div></div>
                    )}
                    {capturedImage ? (
                        <div></div>
                    ) : (
                        <p>To take a picture, follow the hand poses in the order shown below. The system will automatically capture the image once the final pose is detected.</p>
                    )}

                </div>

                <div className="mt-4 p-3 flex justify-center">
                    <div className="flex flex-row items-center space-x-4 sm:space-x-6">
                        <Image
                            src="/one_finger.png"
                            alt="1 finger"
                            width={100}
                            height={100}
                            priority
                            className="w-16 sm:w-24 h-auto"
                        />
                        <ChevronRight className="w-5 h-5 text-gray-500" />

                        <Image
                            src="/two_finger.png"
                            alt="2 fingers"
                            width={100}
                            height={100}
                            priority
                            className="w-16 sm:w-24 h-auto"
                        />

                        <ChevronRight className="w-5 h-5 text-gray-500" />


                        <Image
                            src="/three_finger.png"
                            alt="3 fingers"
                            width={100}
                            height={100}
                            priority
                            className="w-16 sm:w-24 h-auto"
                        />

                    </div>
                </div>

            </div>
        </dialog>
    );
}