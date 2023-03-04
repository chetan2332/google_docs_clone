class ErrorModel {
  final String? error;
  final dynamic data;
  ErrorModel({
    this.error,
    required this.data,
  });

  @override
  String toString() => 'ErrorModel(error: $error, data: $data)';
}
