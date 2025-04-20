document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 10000; // 10 seconds
    
    // Check if Firebase is properly initialized
    if (!window.db || !window.collection || !window.addDoc || !window.serverTimestamp) {
        console.error('Firebase is not properly initialized. Required functions are missing.');
        showError('System error: Database not properly initialized. Please try again later.');
        return;
    }

    console.log('Feedback form initialized with Firebase');

    // Form submission with timeout and retry
    async function submitWithTimeout(feedbackRef, formData, timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const docRef = await Promise.race([
                window.addDoc(feedbackRef, formData),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Submission timeout')), timeout)
                )
            ]);
            clearTimeout(timeoutId);
            return docRef;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    // Form submission
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submission started');

        try {
            // Validate form
            const name = document.getElementById('name').value.trim();
            const category = document.getElementById('category').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            console.log('Form data validation:', {
                name: name ? 'provided' : 'empty',
                category: category ? 'selected' : 'not selected',
                subject: subject ? 'selected' : 'not selected',
                message: message ? 'provided' : 'empty'
            });

            if (!category) {
                showError('Please select a category');
                return;
            }

            if (!message) {
                showError('Please enter your feedback message');
                return;
            }

            // Disable submit button to prevent double submission
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            // Collect form data
            const formData = {
                name: name || 'Anonymous',
                category: category,
                subject: subject || 'N/A',
                message: message,
                timestamp: window.serverTimestamp()
            };

            console.log('Attempting to submit feedback to Firebase');

            // Store feedback in Firebase with retries
            const feedbackRef = window.collection(window.db, 'feedback');
            let lastError = null;
            
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    console.log(`Submission attempt ${attempt} of ${MAX_RETRIES}`);
                    const docRef = await submitWithTimeout(feedbackRef, formData, TIMEOUT_MS);
                    console.log('Feedback submitted successfully with ID:', docRef.id);
                    
                    // Show success message
                    showSuccess('Thank you for your feedback!');
                    
                    // Reset form
                    feedbackForm.reset();
                    
                    // Reset validation classes
                    const inputs = feedbackForm.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => {
                        input.classList.remove('valid', 'error');
                    });
                    
                    return; // Success, exit the function
                } catch (error) {
                    console.error(`Attempt ${attempt} failed:`, error);
                    lastError = error;
                    
                    if (attempt < MAX_RETRIES) {
                        // Wait before retrying (exponential backoff)
                        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                    }
                }
            }
            
            // If we get here, all attempts failed
            throw lastError;
            
        } catch (error) {
            console.error('All submission attempts failed:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            
            let errorMessage = 'Error submitting feedback. ';
            if (error.message === 'Submission timeout') {
                errorMessage += 'The request timed out. Please try again.';
            } else if (error.code === 'permission-denied') {
                errorMessage += 'Access denied. Please check your connection.';
            } else if (error.code === 'unavailable') {
                errorMessage += 'Service is currently unavailable. Please try again later.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            showError(errorMessage);
        } finally {
            // Re-enable submit button
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
        }
    });

    // Show success message
    function showSuccess(message) {
        showAlert(message, 'success');
    }

    // Show error message
    function showError(message) {
        showAlert(message, 'error');
    }

    // Show alert message
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.feedback-intro');
        if (container) {
            container.insertAdjacentElement('afterend', alertDiv);
        } else {
            console.error('Could not find container for alert message');
            document.body.insertBefore(alertDiv, document.body.firstChild);
        }

        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Form validation
    const inputs = feedbackForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });

        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        
        if (input.required && value === '') {
            input.classList.add('error');
            input.classList.remove('valid');
        } else {
            input.classList.remove('error');
            input.classList.add('valid');
        }
    }

    // Test Firebase connection
    try {
        const testRef = window.collection(window.db, 'feedback');
        console.log('Firebase connection test successful');
    } catch (error) {
        console.error('Firebase connection test failed:', error);
        showError('Error connecting to the server. Please try again later.');
    }
}); 