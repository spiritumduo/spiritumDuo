# Testing

Backend testing is done using [Pytest](https://docs.pytest.org/en/7.1.x/). The tests are located in the `tests` directory, and fixtures can be found in `conftest.py`.
  
Testing the GraphQL API is done using httpx against the endpoint. Some tests require overriding some behaviours using [dependancy injection](./dependancy_injection.md).

For example,

```python
@pytest.fixture
def test_email_adapter():
    test_email_adapter = EmailAdapter()
    with app.container.email_client.override(test_email_adapter):
        yield test_email_adapter
```

```python
@pytest.mark.asyncio
async def test_submit_feedback(
    httpx_test_client, httpx_login_user,
    test_email_adapter
):
    def send_email(**kwargs):
        return True
    test_email_adapter.send_email = send_email
```
