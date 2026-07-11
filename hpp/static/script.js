/**
 * Advanced House Price Prediction Engine - High-Fidelity UX Driver
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Core DOM Element Map
    // ==========================================
    const container = document.querySelector('.container');
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const predictionForm = document.getElementById('predictionForm');
    const resultDiv = document.getElementById('result');
    const submitBtn = document.getElementById('submitBtn');
    const scrollBtn = document.getElementById('scrollToTopBtn');

    // Single Main Slider Tracks (Set to Sq.Ft scales)
    const bldgAreaInput = document.getElementById('buildingArea');
    const totalAreaInput = document.getElementById('totalArea');
    
    // Multi-Unit Manual Text Inputs
    const bldgAreaNum = document.getElementById('buildingAreaNum');
    const bldgAreaCentsNum = document.getElementById('buildingAreaCentsNum');
    const totalAreaNum = document.getElementById('totalAreaNum');
    const totalAreaCentsNum = document.getElementById('totalAreaCentsNum');
    
    // Dropdowns 
    const cityDropdown = document.getElementById('city');
    const localityDropdown = document.getElementById('locality');
    const furnishingDropdown = document.getElementById('furnishing');
    
    const numericInputs = document.querySelectorAll('input[type="number"]');

    // Global chart instance tracking handle to prevent rendering overlap crashes
    let pricingChartInstance = null;

    // ==========================================
    // 2. High-End Motion & Parallax Aesthetics
    // ==========================================
    if (container && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 65;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 65;
            container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        document.addEventListener('mouseleave', () => {
            container.style.transform = 'rotateY(0deg) rotateX(0deg)';
            container.style.transition = 'all 0.5s ease';
        });

        container.addEventListener('mouseenter', () => {
            container.style.transition = 'none';
        });
    }

    // ==========================================
    // 2b. Hardware-Accelerated Spotlight Torch Controller
    // ==========================================
    const torchOverlay = document.getElementById('pointerTorch');

    if (torchOverlay) {
        document.addEventListener('mousemove', (e) => {
            torchOverlay.style.setProperty('--mouse-x', `${e.clientX}px`);
            torchOverlay.style.setProperty('--mouse-y', `${e.clientY}px`);
            
            if (torchOverlay.style.opacity === '0' || torchOverlay.style.opacity === '') {
                torchOverlay.style.opacity = '1';
                if (document.documentElement.getAttribute('data-theme') === 'light') {
                    torchOverlay.classList.add('active-light');
                }
            }
        });

        document.addEventListener('mouseleave', () => {
            torchOverlay.style.opacity = '0';
        });
    }

    // ==========================================
    // 3. Theme State Management
    // ==========================================
    const storedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', storedTheme);
    
    if (toggleSwitch) {
        if (storedTheme === 'light') toggleSwitch.checked = true;
        toggleSwitch.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            triggerHapticFeedback(10);
            
            if (torchOverlay) {
                if (theme === 'light') {
                    torchOverlay.classList.add('active-light');
                } else {
                    torchOverlay.classList.remove('active-light');
                }
            }
        });
    }

    // ==========================================
    // 4. Multi-Unit Two-Way Conversion Engine (Sq.Ft <-> Cents)
    // ==========================================
    const SQFT_PER_CENT = 435.6;

    function triggerHapticFeedback(duration) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    function syncAreaMetrics(changedInputType, groupPrefix, value) {
        const mainSlider = document.getElementById(`${groupPrefix}Area`);
        const sqftNum = document.getElementById(`${groupPrefix}AreaNum`);
        const centsNum = document.getElementById(`${groupPrefix}AreaCentsNum`);

        if (!mainSlider || !sqftNum || !centsNum) return;

        let incomingValue = parseFloat(value);
        if (isNaN(incomingValue)) return; 

        let sqftVal = 0;
        let centsVal = 0;

        if (changedInputType === 'sqft') {
            sqftVal = incomingValue;
            centsVal = sqftVal / SQFT_PER_CENT;
        } else if (changedInputType === 'cents') {
            centsVal = incomingValue;
            sqftVal = centsVal * SQFT_PER_CENT;
        }

        const minSqft = parseFloat(mainSlider.min);
        const maxSqft = parseFloat(mainSlider.max);

        if (sqftVal < minSqft) { sqftVal = minSqft; centsVal = minSqft / SQFT_PER_CENT; }
        if (sqftVal > maxSqft) { sqftVal = maxSqft; centsVal = maxSqft / SQFT_PER_CENT; }

        mainSlider.value = Math.round(sqftVal);
        
        if (document.activeElement !== sqftNum) sqftNum.value = Math.round(sqftVal);
        if (document.activeElement !== centsNum) centsNum.value = centsVal.toFixed(2);

        triggerHapticFeedback(4);
    }

    // Building Area Event Listeners
    if (bldgAreaInput) {
        bldgAreaInput.addEventListener('input', (e) => syncAreaMetrics('sqft', 'building', e.target.value));
    }
    if (bldgAreaNum) {
        bldgAreaNum.addEventListener('input', (e) => {
            let cleanVal = parseFloat(e.target.value);
            if (!isNaN(cleanVal)) syncAreaMetrics('sqft', 'building', cleanVal);
        });
    }
    if (bldgAreaCentsNum) {
        bldgAreaCentsNum.addEventListener('input', (e) => {
            let cleanVal = parseFloat(e.target.value);
            if (!isNaN(cleanVal)) syncAreaMetrics('cents', 'building', cleanVal);
        });
    }

    // Total Land Area Event Listeners
    if (totalAreaInput) {
        totalAreaInput.addEventListener('input', (e) => syncAreaMetrics('sqft', 'total', e.target.value));
    }
    if (totalAreaNum) {
        totalAreaNum.addEventListener('input', (e) => {
            let cleanVal = parseFloat(e.target.value);
            if (!isNaN(cleanVal)) syncAreaMetrics('sqft', 'total', cleanVal);
        });
    }
    if (totalAreaCentsNum) {
        totalAreaCentsNum.addEventListener('input', (e) => {
            let cleanVal = parseFloat(e.target.value);
            if (!isNaN(cleanVal)) syncAreaMetrics('cents', 'total', cleanVal);
        });
    }

    // Advanced Focus Selection Engine & Blur Guards
    ['buildingAreaNum', 'buildingAreaCentsNum', 'totalAreaNum', 'totalAreaCentsNum'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const prefix = id.includes('building') ? 'building' : 'total';
            const type = id.includes('Cents') ? 'cents' : 'sqft';
            
            input.addEventListener('focus', () => {
                setTimeout(() => { input.select(); }, 10);
            });
            
            input.addEventListener('blur', () => {
                let val = parseFloat(input.value);
                const mainSlider = document.getElementById(`${prefix}Area`);
                if (isNaN(val)) {
                    val = type === 'cents' ? parseFloat(mainSlider.value) / SQFT_PER_CENT : parseFloat(mainSlider.value);
                }
                syncAreaMetrics(type, prefix, val);
                
                if (type === 'sqft') input.value = Math.round(val);
                if (type === 'cents') input.value = val.toFixed(2);
            });
        }
    });

    if (bldgAreaInput) syncAreaMetrics('sqft', 'building', parseFloat(bldgAreaInput.value));
    if (totalAreaInput) syncAreaMetrics('sqft', 'total', parseFloat(totalAreaInput.value));

    // ==========================================
    // 5. Intelligent Input Guards
    // ==========================================
    numericInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (['-', 'e', '+'].includes(e.key)) e.preventDefault();
        });

        input.addEventListener('input', () => {
            if (parseFloat(input.value) >= 0) {
                input.classList.remove('invalid-field');
            }
        });
    });

    function triggerErrorState(message) {
        triggerHapticFeedback(100);
        container.style.animation = 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both';
        resultDiv.innerHTML = `
            <div class="result-card" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.25);">
                <h3 style="color: #ef4444; text-align: center; width: 100%;">${message}</h3>
            </div>`;
        
        setTimeout(() => {
            container.style.animation = '';
        }, 400);
    }

    // ==========================================
    // 6. Fluid Price Counter Interpolator
    // ==========================================
    function animatePriceCounter(targetValue, serverResponseData) {
        const duration = 1200; 
        const startTime = performance.now();
        
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        });

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeOutProgress * targetValue);
            
            resultDiv.innerHTML = `
                <div class="result-card">
                    <h3>Estimated Value: ${formatter.format(currentValue)}</h3>
                    <button type="button" class="copy-btn" id="copyBadgeBtn" disabled style="opacity:0.5;">Copy</button>
                </div>`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                resultDiv.innerHTML = `
                    <div class="result-card">
                        <h3>Estimated Value: ${formatter.format(targetValue)}</h3>
                        <button type="button" class="copy-btn" id="copyBadgeBtn">Copy Price</button>
                    </div>`;
                bindCopyAction(formatter.format(targetValue));
                renderInteractiveAnalytics(targetValue, serverResponseData);
            }
        }
        requestAnimationFrame(updateCounter);
    }

    function bindCopyAction(textToCopy) {
        const copyBtn = document.getElementById('copyBadgeBtn');
        if (!copyBtn) return;
        
        copyBtn.addEventListener('click', () => {
            triggerHapticFeedback(30);
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyBtn.textContent = "Copied! ✓";
                copyBtn.style.setProperty('background', '#10b981', 'important');
                copyBtn.style.setProperty('color', '#ffffff', 'important');
                copyBtn.style.setProperty('border-color', 'transparent', 'important');
                
                setTimeout(() => { 
                    copyBtn.textContent = "Copy Price"; 
                    copyBtn.style.setProperty('background', 'rgba(16, 185, 129, 0.15)', 'important');
                    copyBtn.style.setProperty('color', '#10b981', 'important');
                    copyBtn.style.setProperty('border-color', 'rgba(16, 185, 129, 0.35)', 'important');
                }, 2000);
            });
        });
    }

    // ==========================================
    // 6b. Interactive Analytics Chart & AI Breakdown
    // ==========================================
    function renderInteractiveAnalytics(predictedPrice, rawResponse) {
        const analyticsSection = document.getElementById('analyticsSection');
        const pricePerSqftTarget = document.getElementById('pricePerSqft');
        const propertyTierTarget = document.getElementById('propertyTier');
        
        const cityElement = document.getElementById('city');
        const currentCity = cityElement && cityElement.value !== "" ? cityElement.value : "Chennai";
        
        const areaSlider = document.getElementById('buildingArea');
        const areaBox = document.getElementById('buildingAreaNum');
        const bldgArea = areaSlider ? parseFloat(areaSlider.value) : (areaBox ? parseFloat(areaBox.value) : 1200);

        if (!analyticsSection) return;

        const ratePerSqft = Math.round(predictedPrice / bldgArea);
        pricePerSqftTarget.textContent = `₹${ratePerSqft.toLocaleString('en-IN')} / Sq.Ft`;

        if (ratePerSqft > 6500) {
            propertyTierTarget.textContent = "Ultra Luxury";
            propertyTierTarget.style.color = "#a78bfa"; 
        } else if (ratePerSqft > 4500) {
            propertyTierTarget.textContent = "Premium Tier";
            propertyTierTarget.style.color = "#38bdf8"; 
        } else {
            propertyTierTarget.textContent = "Standard Tier";
            propertyTierTarget.style.color = "var(--text-main)";
        }

        analyticsSection.classList.remove('hidden-analytics');

        const baselineFactors = { "Chennai": 1.25, "Coimbatore": 1.05, "Madurai": 0.95, "Trichy": 0.88, "Salem": 0.82 };
        const rawBase = predictedPrice / (baselineFactors[currentCity] || 1.0);
        
        const cities = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"];
        const chartDataValues = cities.map(c => Math.round(rawBase * baselineFactors[c]));

        if (pricingChartInstance) {
            pricingChartInstance.destroy();
        }

        const ctx = document.getElementById('cityComparisonChart').getContext('2d');
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        const gridAndTextColor = isDarkTheme ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.7)';

        pricingChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: cities,
                datasets: [{
                    label: 'Estimated Valuation Comparison (₹)',
                    data: chartDataValues,
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: cities.map(c => c === currentCity ? '#10b981' : '#38bdf8'),
                    pointRadius: cities.map(c => c === currentCity ? 7 : 4),
                    tension: 0.35,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ' Value: ₹' + context.raw.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: gridAndTextColor } },
                    y: { 
                        ticks: { color: gridAndTextColor, callback: v => '₹' + (v / 100000).toFixed(1) + 'L' },
                        grid: { color: isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)' }
                    }
                }
            }
        });

        let serverImpacts = null;
        if (rawResponse) {
            if (rawResponse.impacts) serverImpacts = rawResponse.impacts;
            else if (rawResponse.data && rawResponse.data.impacts) serverImpacts = rawResponse.data.impacts;
            else if (typeof rawResponse === 'object' && 'space_impact' in rawResponse) serverImpacts = rawResponse;
        }

        if (!serverImpacts) {
            const fallbackBldgArea = parseFloat(document.getElementById('buildingAreaNum')?.value) || 1200;
            const fallbackBedrooms = parseInt(document.getElementById('bedrooms')?.value, 10) || 3;
            const fallbackParking = parseInt(document.getElementById('parking')?.value, 10) || 1;
            const fallbackAge = parseInt(document.getElementById('age')?.value, 10) || 0;

            serverImpacts = {
                space_impact: Math.round(fallbackBldgArea * 4800),
                room_impact: fallbackBedrooms * 250000,
                parking_impact: fallbackParking * 120000,
                depreciation: Math.abs(fallbackAge * -45000)
            };
        }

        if (serverImpacts) {
            const format = v => '₹' + Math.abs(v).toLocaleString('en-IN');
            
            const spaceVal = Math.abs(parseInt(serverImpacts.space_impact)) || 0;
            const roomVal = Math.abs(parseInt(serverImpacts.room_impact)) || 0;
            const parkingVal = Math.abs(parseInt(serverImpacts.parking_impact)) || 0;
            const ageVal = Math.abs(parseInt(serverImpacts.depreciation || serverImpacts.age_impact)) || 0;

            document.getElementById('txtSpace').textContent = format(spaceVal);
            document.getElementById('txtRooms').textContent = format(roomVal);
            document.getElementById('txtParking').textContent = format(parkingVal);
            document.getElementById('txtAge').textContent = ageVal === 0 ? '₹0' : `-₹${ageVal.toLocaleString('en-IN')}`;

            const maxBaseline = Math.max(spaceVal, roomVal, parkingVal, ageVal, 1);
            
            setTimeout(() => {
                document.getElementById('barSpace').style.width = `${(spaceVal / maxBaseline) * 100}%`;
                document.getElementById('barRooms').style.width = `${(roomVal / maxBaseline) * 100}%`;
                document.getElementById('barParking').style.width = `${(parkingVal / maxBaseline) * 100}%`;
                document.getElementById('barAge').style.width = `${(ageVal / maxBaseline) * 100}%`;
            }, 150);
        }
    }

    // ==========================================
    // 7. Core Form Submission Processing Pipeline
    // ==========================================
    if (predictionForm && resultDiv) {
        predictionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let formIsValid = true;

            const liveNumericInputs = predictionForm.querySelectorAll('input[type="number"]');
            liveNumericInputs.forEach(input => {
                const val = parseFloat(input.value);
                if (input.hasAttribute('required') && (isNaN(val) || val < 0)) {
                    input.classList.add('invalid-field');
                    formIsValid = false;
                }
            });

            const liveBldgArea = document.getElementById('buildingArea');
            const liveTotalArea = document.getElementById('totalArea');

            if (cityDropdown && cityDropdown.value === "") {
                cityDropdown.classList.add('invalid-field');
                formIsValid = false;
            } else if (cityDropdown) {
                cityDropdown.classList.remove('invalid-field');
            }

            if (localityDropdown && (localityDropdown.value === "" || localityDropdown.disabled)) {
                localityDropdown.classList.add('invalid-field');
                formIsValid = false;
            } else if (localityDropdown) {
                localityDropdown.classList.remove('invalid-field');
            }

            if (furnishingDropdown && furnishingDropdown.value === "") {
                furnishingDropdown.classList.add('invalid-field');
                formIsValid = false;
            } else if (furnishingDropdown) {
                furnishingDropdown.classList.remove('invalid-field');
            }

            if (!formIsValid) {
                triggerErrorState('⚠️ Selection Warning: Please select a valid City, Locality Area, and Furnishing status.');
                return;
            }

            const payload = {
                city: cityDropdown.value,
                locality: localityDropdown ? localityDropdown.value : "Standard",
                buildingArea: liveBldgArea ? parseFloat(liveBldgArea.value) : 1200,
                totalArea: liveTotalArea ? parseFloat(liveTotalArea.value) : 2000,
                bedrooms: parseInt(document.getElementById('bedrooms').value, 10) || 0,
                bathrooms: parseInt(document.getElementById('bathrooms').value, 10) || 0,
                floors: parseInt(document.getElementById('floors').value, 10) || 1,
                parking: parseInt(document.getElementById('parking').value, 10) || 0,
                age: parseInt(document.getElementById('age').value, 10) || 0,
                furnishing: furnishingDropdown.value
            };

            if (payload.buildingArea > payload.totalArea) {
                triggerErrorState('⚠️ Building area cannot exceed total land footprint.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<div class="spinner"></div> Calculating Fair Value...`;
            resultDiv.innerHTML = `<p style="color: var(--text-muted); font-style: italic; text-align: center; animation: fadeIn 0.4s ease-out;">Analysing database matrices...</p>`;

            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid Server Output Header Structure");
                }

                const data = await response.json();
                
                if (response.ok) {
                    animatePriceCounter(data.price, data);
                } else {
                    triggerErrorState(`⚠️ Error: ${data.error}`);
                }
            } catch (error) {
                triggerErrorState('⚠️ Application pipeline network processing failure.');
                console.error("Pipeline Context Error:", error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Predict Price";
            }
        });
    }

    ['city', 'locality', 'furnishing'].forEach(id => {
        const menu = document.getElementById(id);
        if (menu) {
            menu.addEventListener('change', () => {
                if (menu.value !== "") menu.classList.remove('invalid-field');
            });
        }
    });

    // ==========================================
    // 8. Viewport Scroll Automation Engine
    // ==========================================
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 250) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 9. Enter Key Focus Navigation Engine
    // ==========================================
    if (predictionForm) {
        predictionForm.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (e.target.type === 'submit') return;
                e.preventDefault(); 

                const focusableFields = Array.from(predictionForm.querySelectorAll(
                    'select, input[type="number"], input[type="range"]'
                ));

                const index = focusableFields.indexOf(e.target);

                if (index > -1 && index < focusableFields.length - 1) {
                    focusableFields[index + 1].focus();
                    if (focusableFields[index + 1].type === 'number') {
                        focusableFields[index + 1].select();
                    }
                } else if (index === focusableFields.length - 1) {
                    if (submitBtn) submitBtn.focus();
                }
            }
        });
    }

    // ==========================================
    // 10. Location Intelligence - Micro Locality Mapping Engine
    // ==========================================
    const localityDatabase = {
        "Chennai": ["Adyar", "Anna Nagar", "Velachery", "T Nagar", "Tambaram"],
        "Coimbatore": ["Ramanathapuram", "RS Puram", "Gandhipuram", "Peelamedu", "Saravanampatti"],
        "Madurai": ["Anna Nagar", "KK Nagar", "K Pudur", "Othakadai", "Thirunagar"],
        "Trichy": ["Thillai Nagar", "Cantonment", "Srirangam", "KKT Nagar", "KK Nagar"],
        "Salem": ["Fairlands", "Meyyanur", "Hasthampatti", "Ammapet", "Suramangalam"]
    };

    if (cityDropdown && localityDropdown) {
        cityDropdown.addEventListener('change', () => {
            const chosenCity = cityDropdown.value;
            localityDropdown.innerHTML = `<option value="" disabled selected class="placeholder-option">Set Locality</option>`;
            
            if (localityDatabase[chosenCity]) {
                localityDropdown.disabled = false;
                localityDatabase[chosenCity].forEach(neighborhood => {
                    const optionElement = document.createElement('option');
                    optionElement.value = neighborhood;
                    optionElement.textContent = neighborhood;
                    localityDropdown.appendChild(optionElement);
                });
            } else {
                localityDropdown.disabled = true;
            }
        });
    }
});

    // ==========================================
    // 11. One-Click Form Fields Reset Controller (MANUAL INJECTION PURGE)
    // ==========================================
    const clearFieldsBtn = document.getElementById('clearFieldsBtn');
    
    if (clearFieldsBtn) {
        clearFieldsBtn.addEventListener('click', () => {
            // Trigger tactile audio haptic feedback confirmation
            if (typeof triggerHapticFeedback === 'function') {
                triggerHapticFeedback(15);
            }
            
            // Direct split-second runtime element mapping lookup
            const targetResultCard = document.getElementById('result');
            const targetAnalyticsSection = document.getElementById('analyticsSection');
            const targetLocalityDropdown = document.getElementById('locality');
            const targetCityDropdown = document.getElementById('city');
            const targetFurnishingDropdown = document.getElementById('furnishing');

            // 1. Core Fix: Manually sweep through and wipe all numerical text fields to clear browser value cache
            const allNumberBoxes = document.querySelectorAll('#predictionForm input[type="number"]');
            allNumberBoxes.forEach(input => {
                input.value = ""; // Absolute clean-slate wipe out
            });

            // 2. Force reset sliders back to absolute minimum starting positions
            const liveBldgArea = document.getElementById('buildingArea');
            const liveTotalArea = document.getElementById('totalArea');
            
            if (liveBldgArea) liveBldgArea.value = liveBldgArea.min || "100";
            if (liveTotalArea) liveTotalArea.value = liveTotalArea.min || "100";

            // 3. Clear primary selections back to default placeholder slots
            if (targetCityDropdown) targetCityDropdown.value = "";
            if (targetFurnishingDropdown) targetFurnishingDropdown.value = "";

            // 4. Relock dependent neighborhood dropdown parameters cleanly
            if (targetLocalityDropdown) {
                targetLocalityDropdown.innerHTML = `<option value="" disabled selected class="placeholder-option">Select City First</option>`;
                targetLocalityDropdown.disabled = true;
            }

            // 5. Force numerical layout updates to re-synchronize input boxes back to baseline markers
            if (typeof syncAreaMetrics === 'function') {
                if (liveBldgArea) syncAreaMetrics('sqft', 'building', liveBldgArea.value);
                if (liveTotalArea) syncAreaMetrics('sqft', 'total', liveTotalArea.value);
            }

            // 6. Wipe out active calculation results display card text node
            if (targetResultCard) {
                targetResultCard.innerHTML = '';
            }
            
            // 7. Hide lower analytics charts and progress bars fluidly
            if (targetAnalyticsSection) {
                targetAnalyticsSection.classList.add('hidden-analytics');
            }
            
            // 8. Destroy active Chart.js grid layers to prevent tooltip memory leaks
            if (pricingChartInstance) {
                pricingChartInstance.destroy();
                pricingChartInstance = null;
            }
            
            // 9. Strip away red field validation alert warning frames
            const activeErrors = document.querySelectorAll('.invalid-field');
            activeErrors.forEach(el => el.classList.remove('invalid-field'));
        });
    }
