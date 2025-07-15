output "bucket_name" {
  value = aws_s3_bucket.tts_audio_bucket.bucket
}

output "bucket_url" {
  value = "https://${aws_s3_bucket.tts_audio_bucket.bucket}.s3.amazonaws.com/"
}
