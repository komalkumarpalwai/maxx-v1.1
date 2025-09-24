import * as XLSX from 'xlsx';

export const parseQuestionFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const extension = file.name.split('.').pop().toLowerCase();
        let questions = [];

        switch (extension) {
          case 'xlsx':
          case 'xls': {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);
            questions = rows.map(row => ({
              question: row.question || '',
              option1: row.option1 || '',
              option2: row.option2 || '',
              option3: row.option3 || '',
              option4: row.option4 || '',
              correctAnswer: row.correctAnswer || '',
              points: row.points || 1
            }));
            break;
          }
          case 'json': {
            const jsonData = JSON.parse(event.target.result);
            questions = Array.isArray(jsonData) ? jsonData : [jsonData];
            break;
          }
          case 'csv':
          case 'txt': {
            const text = event.target.result;
            const lines = text.split(/\\r?\\n/);
            const headers = lines[0].split(/[,\\t]/).map(h => h.trim());
            
            questions = lines.slice(1).map(line => {
              const values = line.split(/[,\\t]/);
              const question = {};
              headers.forEach((header, index) => {
                question[header] = values[index]?.trim() || '';
              });
              return question;
            });
            break;
          }
          default:
            throw new Error('Unsupported file format');
        }

        resolve(questions);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('File read error'));

    if (file.name.match(/\\.(xlsx|xls)$/)) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export const validateQuestions = (questions) => {
  return questions.map((q, index) => {
    const errors = [];
    if (!q.question?.trim()) errors.push('Question text is required');
    if (!q.option1?.trim()) errors.push('Option 1 is required');
    if (!q.option2?.trim()) errors.push('Option 2 is required');
    if (!q.option3?.trim()) errors.push('Option 3 is required');
    if (!q.option4?.trim()) errors.push('Option 4 is required');
    
    const correctAnswer = parseInt(q.correctAnswer);
    if (isNaN(correctAnswer) || correctAnswer < 1 || correctAnswer > 4) {
      errors.push('Correct answer must be a number between 1 and 4');
    }

    return {
      question: q,
      index,
      isValid: errors.length === 0,
      errors
    };
  });
};