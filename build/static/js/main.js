document.addEventListener('DOMContentLoaded', function() {
    const surveyForm = document.getElementById('survey-form');
    const resultDiv = document.getElementById('result');
    const analysisResult = document.getElementById('analysis-result');
    const analyzeButton = document.getElementById('analyze-button');

    if (surveyForm) {
        surveyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(surveyForm);
            
            axios.post('/submit_survey', formData)
                .then(function(response) {
                    surveyForm.classList.add('hidden');
                    resultDiv.classList.remove('hidden');
                    analysisResult.innerHTML = response.data.replace(/\n/g, '<br>');
                })
                .catch(function(error) {
                    console.error('Error:', error);
                    alert('설문 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
                });
        });
    }

    if (analyzeButton) {
        analyzeButton.addEventListener('click', function() {
            axios.post('/analyze')
                .then(function(response) {
                    const result = response.data;
                    let html = `
                        <div class="analysis-section">
                            <h3>${result.personality.title}</h3>
                            <p>${result.personality.description}</p>
                            <ul>
                                ${result.personality.traits.map(trait => `<li>${trait}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="analysis-section">
                            <h3>${result.psychological_state.title}</h3>
                            <p>${result.psychological_state.description}</p>
                            <ul>
                                ${result.psychological_state.key_points.map(point => `<li>${point}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="analysis-section">
                            <h3>${result.current_status.title}</h3>
                            <p>${result.current_status.description}</p>
                            <h4>강점</h4>
                            <ul>
                                ${result.current_status.strengths.map(strength => `<li>${strength}</li>`).join('')}
                            </ul>
                            <h4>도전 과제</h4>
                            <ul>
                                ${result.current_status.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="analysis-section">
                            <h3>${result.potential_risks.title}</h3>
                            <p>${result.potential_risks.description}</p>
                            <h4>위험 요소</h4>
                            <ul>
                                ${result.potential_risks.risk_factors.map(risk => `<li>${risk}</li>`).join('')}
                            </ul>
                            <h4>권장 사항</h4>
                            <ul>
                                ${result.potential_risks.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                    analysisResult.innerHTML = html;
                })
                .catch(function(error) {
                    console.error('Analysis Error:', error);
                    alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
                });
        });
    }
});
