import torch
import torch.nn as nn
import torch.nn.functional as f


class FootballPredictor(nn.Module):
    def __init__(self, input_size = 30, hidden_size = 128, num_classes = 3):
        super(FootballPredictor, self) .__init__()

        self.fc1 = nn.Linear(input_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, 64)
        self.fc4 = nn.Linear(64, num_classes)

        self.dropout = nn.Dropout(0.3)
        self.batch_norm1 = nn.BatchNorm1d(hidden_size)
        self.batch_norm2 = nn.BatchNorm1d(hidden_size)


    def forward(self, x):
        x = f.relu(self.fc1(x))
        x = self.batch_norm1(x)
        x = self.dropout(x)

        x = f.relu(self.fc2(x))
        x = self.batch_norm2(x)
        x = self.dropout(x)

        x = f.relu(self.fc3(x))
        x = self.fc4(x)

        return f.softmax(x, dim=1)


def init_model():
    model = FootballPredictor()
    for m in model.modules():
        if isinstance(m, nn.Linear):
            nn.init.kaiming_normal(m.weight)
    return model