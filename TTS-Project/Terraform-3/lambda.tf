resource "aws_iam_role" "lambda_role" {
  name = "tts-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "tts-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:*"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "polly:SynthesizeSpeech"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject"
        ],
        Resource = "${aws_s3_bucket.tts_audio_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_lambda_function" "tts_lambda" {
  function_name = "TTSLambda"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role.arn

  filename = "../my_lambda/lambda_function_payload.zip"
  source_code_hash = filebase64sha256("../my_lambda/lambda_function_payload.zip")

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.tts_audio_bucket.bucket
    }
  }
}

output "lambda_function_name" {
  value = aws_lambda_function.tts_lambda.function_name
}
